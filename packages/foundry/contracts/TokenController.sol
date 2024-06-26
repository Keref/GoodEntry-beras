//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ITokenAction.sol";
import "./interfaces/IUniswapV2Router.sol";
import "./Token.sol";

/**
 * @notice Token Center
 * @dev Allows creating a token and buying/selling on a XY=k bonding curve
 * Mechanics:
 * - lottery 100x or bust tickets
 * - part of trading fees going to highest volume coin
 * - Bonding Curve: a simple Uniswap constant product, with a `slope` to shift the curve left (limit early buyer advantage)
        quote * (base + slope) = k * slope
 */
contract TokenController is Ownable {
  // Events
  event Buy(address indexed user, address indexed token, uint amount, uint quoteAmount);
  event Sell(address indexed user, address indexed token, uint amount, uint quoteAmount);
  event CreateToken(address indexed user, address indexed token);
  event BuyTicket(address indexed user, address indexed token, uint amount, uint round);
  event WinningClaim(address indexed user, address indexed token, uint amount);
  event HourlyJackpot(address indexed token, uint jackpot, uint volume);
  event Ejected(address indexed token, uint amountBase, uint amountQuote);
  
  // Admin events
  event SetTradingFees(uint tradingFee, uint treasuryFee);
  event SetTreasury(address treasury);
  event SetSlope(uint slope);
  event SetMcapToAmm(uint mcapToAmm);
  event SetLotteryThreshold(uint lotteryThreshold);

  //////////// Tokens variables
  uint public constant TOTAL_SUPPLY = 1_000_000_000e18;
  // Use TOTAL_SUPPLY as constant product
  // (quoteAmount/(quoteAmountAt50percentDistribution) + 1) * baseAmount = totalSupply
  // slope defines aggressiveness, and is the amount of quote necessary to sell out half the supply
  // so marketing parameter, depends on the quote token value
  uint public slope;
  uint public lotteryThreshold;
  
  uint16 public tradingFee; // trading fee X4: 10000 is 100%
  uint16 public treasuryFee; // trading fee X4: 10000 is 100%
  address public treasury;

  
  address[] public tokens;
  mapping(string => address) public tickers;
  
  struct AmmBalances {
    uint baseBalance;
    uint quoteBalance;
  }
  mapping(address => AmmBalances) public balances;
  // Last daily swap
  mapping(address => mapping(uint32 => uint)) public tokenDailyCloses;
    
    
  // After a given mcap is reached part of liquidity deposited in AMM, default 50k BERA
  address public ammRouter;
  uint public mcapToAmm;
  
  /////////// Lottery vars
  bool public isLotteryRunning = true;
  
  struct LotterySettings {
    uint strike;
    uint payoutPerTicket;
    uint totalOI;
  }
  mapping(address => mapping(uint32 => LotterySettings)) public tokenDailyLotterySettings;
  mapping(address => mapping(uint32 => mapping(address => uint))) public tokenDailyLotteryUserBalances;
  
  //////////// Daily jackpot vars: track volume, top 3 volumes win jackpot
  mapping(uint32 => uint) public dailyJackpot;
  mapping(uint32 => bool) public isDistributedDailyJackpot;
  mapping(uint32 => address[3]) public dailyVolumeLeaders;
  mapping(address => mapping(uint32 => uint)) public tokenDailyVolume;
  
  //////////// Hourly jackpot vars: track volume, top volume wins jackpot
  mapping(uint32 => uint) public hourlyJackpot;
  mapping(uint32 => bool) public isDistributedHourlyJackpot;
  mapping(uint32 => address) public hourlyVolumeLeader;
  mapping(address => mapping(uint32 => uint)) public tokenHourlyVolume;
  
  
  constructor (address _ammRouter) {
    initialize(_ammRouter);
  }
  
  function initialize(address _ammRouter) public {
    require(treasury == address(0), "Already Init");
    _transferOwnership(msg.sender);
    require(_ammRouter != address(0), "Invalid AMM");
    ammRouter = _ammRouter;
    setTradingFees(10, 10); // initial trading fee: 0.1% treasury: 0.1%
    setTreasury(msg.sender);
    setSlope(50_000e18);
    setLotteryThreshold(100e18);
    setMcapToAmm(50e18);
  }
  
  ///////////////// ADMIN FUNCTIONS
  
  /// @notice Set the trading fee
  function setTradingFees(uint16 _tradingFee, uint16 _treasuryFee) public onlyOwner {
    require(_tradingFee < 100 && _treasuryFee < 100, "Trading fee too high");
    tradingFee = _tradingFee;
    treasuryFee = _treasuryFee;
    emit SetTradingFees(_tradingFee, _treasuryFee);
  }
  
  /// @notice  Set treasury address
  function setTreasury(address _treasury) public onlyOwner {
    require(_treasury != address(0), "Invalid treasury");
    treasury = _treasury;
    emit SetTreasury(_treasury);
  }
  
  /// @notice  Set treasury address
  function setSlope(uint _slope) public onlyOwner {
    require(_slope > 1e18, "Invalid slope");
    slope = _slope;
    emit SetSlope(_slope);
  }
  
  /// @notice Set minimum tvl for action to be taken
  function setMcapToAmm(uint _mcapToAmm) public onlyOwner {
    require(_mcapToAmm > 1e18 && _mcapToAmm < 100_000_000e18, "Invalid Mcap");
    mcapToAmm = _mcapToAmm;
    emit SetMcapToAmm(_mcapToAmm);
  }
  
  // @notice Set mcap from which lottery can run
  function setLotteryThreshold(uint _lotteryThreshold) public onlyOwner {
    require(_lotteryThreshold > 1e18 && _lotteryThreshold < 500_000e18, "Invalid threshold");
    lotteryThreshold = _lotteryThreshold;
    emit SetLotteryThreshold(_lotteryThreshold);
  }
  
  /// @notice Enable/disable daily lottery
  function setLotteryRunning(bool isRunning) public onlyOwner {
    isLotteryRunning = isRunning;
  }
  
  /// @notice Sets the AMM address
  function setAmmRouter(address _ammRouter) public onlyOwner {
    require(_ammRouter != address(0), "Invalid AMM router");
    ammRouter = _ammRouter;
  }
  
  
  ///////////////// USEFUL GETTERS
  
  function getTokensLength() public view returns (uint) {return tokens.length;}
  
  /// @notice Get latest tokens, convenient in some cases
  function getLastTokens() public view returns (address[] memory lastTokens){
    uint tlen = tokens.length;
    uint max = tlen;
    if (max > 20) max = 20;
    lastTokens = new address[](max);
    for (uint k = 1 ; k <= max; k++) lastTokens[k-1] = tokens[tlen - k];
  }
  
  /// @notice Get token mcap
  function getMcap(address token) public view returns (uint mcap) {
    AmmBalances memory bals = balances[token];
    if (bals.baseBalance > 0) mcap = bals.quoteBalance * ERC20(token).totalSupply() / bals.baseBalance;
  }
  
  /// @notice Token price e18, i.e token amount per 1 ETH
  /// @dev We use the bonding curve to get the price based on a very small amount of quote
  function getPrice(address token) public view returns (uint price){
    uint baseAmount = getBuyAmount(token, 1e9);
    if (baseAmount == 0) baseAmount = 1;
    price = 1e27 / baseAmount;
  }
  
  
  /// @notice Get lottery settings
  function getLotterySettings(address token, uint32 round) public view returns (uint strike, uint payoutPerTicket, uint totalOI){
    LotterySettings memory ls = tokenDailyLotterySettings[token][round];
    strike = ls.strike;
    payoutPerTicket = ls.payoutPerTicket;
    totalOI = ls.totalOI;
  }
  
  /// @notice Get user lottery payout
  function getUserLotteryPayout(address token, uint32 round, address user) public view returns (uint userPayout){
    userPayout = tokenDailyLotteryUserBalances[token][round][user];
  }
  
  /// @notice Get token hourly volume
  function getTokenHourlyVolume(address token, uint32 _hhour) public view returns (uint volume){
    volume = tokenHourlyVolume[token][_hhour];
  }
  /// @notice Get token daily volume
  function getTokenDailyVolume(address token, uint32 _day) public view returns (uint volume){
    volume = tokenDailyVolume[token][_day];
  }
  
  /// @notice Get daily volume leaders
  function getDailyVolumeLeaders(uint32 _day) public view returns (address[3] memory leaders, uint[3] memory volumes){
    leaders = dailyVolumeLeaders[_day];
    volumes[0] = tokenDailyVolume[leaders[0]][_day];
    volumes[1] = tokenDailyVolume[leaders[1]][_day];
    volumes[2] = tokenDailyVolume[leaders[2]][_day];
  }
  
  ///////////////// BUY/SELL FUNCTIONS
  
  /// @notice Create a token
  function createToken(string memory name, string memory symbol, string memory desc) public payable returns (address token, uint baseAmount){
    require(tickers[symbol] == address(0), "Create: Already registered");
    token = address(new Token(name, symbol, desc, TOTAL_SUPPLY));
    tickers[symbol] = token;
    balances[token] = AmmBalances(TOTAL_SUPPLY, 0);
    tokens.push(token);
    emit CreateToken(msg.sender, token);
    // min bought 0 as cant be frontrun here
    if (msg.value > 0) baseAmount = buy(token, 0);
  }
  
  /// @notice Get token amount bought
  function getBuyAmount(address token, uint quoteAmount) public view returns (uint buyAmount) {
    AmmBalances memory bals = balances[token];
    if (bals.baseBalance == 0) return 0;
    // (quoteBalanceBefore/slope + 1) * baseBalanceBefore = constantProduct = (quoteBalanceAfter/slope + 1) * baseBalanceAfter
    // => baseBalanceAfter = baseBalanceBefore - buyAmount = constantProduct *slope / (quoteBalanceAfter + slope)
    buyAmount = bals.baseBalance - TOTAL_SUPPLY * slope / (bals.quoteBalance + quoteAmount + slope);
  }
  

  /// @notice Buy token, with minAmount to prevent excessive slippage
  function buy(address token, uint minBoughtTokens) public payable returns (uint baseAmount){
    require(msg.value > 0, "Swap: Invalid buy amount");
    require(balances[token].baseBalance > 0, "Swap: Cannot buy this token");
    // distribute jackpots: first hourly, then the daily (may impact the daily winner )))
    distributeJackpots();
    _incTokenVolume(token, msg.value);
    // set yesterday's close if necessary so lottery holders can claim
    if (tokenDailyCloses[token][today()-1] == 0) _setDailyClose(token, today() - 1); 
    // fees
    uint _tradingFee = msg.value * tradingFee / 1e4;
    uint _treasuryFee = msg.value * treasuryFee / 1e4;
    (bool success, ) = payable(treasury).call{value: _treasuryFee}("");
    require(success, "Swap: Error sending quote");
    _depositJackpots(_tradingFee);
    
    baseAmount = getBuyAmount(token, msg.value - _tradingFee - _treasuryFee);
    require(baseAmount >= minBoughtTokens, "Swap: Excessive slippage");
    require(baseAmount <= balances[token].baseBalance, "Swap: Excessive buy amount");
    balances[token].baseBalance -= baseAmount;
    balances[token].quoteBalance += msg.value - _tradingFee - _treasuryFee;

    ERC20(token).transfer(msg.sender, baseAmount);
    _setDailyClose(token, today()); //set today's close
    emit Buy(msg.sender, token, baseAmount, msg.value);
  }
  
  
  /// @notice Get base token amount from sale
  function getAmountSale(address token, uint baseAmount) public view returns (uint quoteAmount){
    AmmBalances memory bals = balances[token];
    if (bals.quoteBalance == 0) return 0;
    // constantProduct = (quoteBalanceAfter/slope + 1) * baseBalanceAfter  = (quoteBalanceAfter + slope) * baseBalanceAfter / slope
    // => quoteBalanceAfter + slope = quoteBalanceBefore - quoteAmount + slope 
    //      = constantProduct * slope / baseBalanceAfter
    quoteAmount = bals.quoteBalance + slope - TOTAL_SUPPLY * slope / (bals.baseBalance + baseAmount);
  }
  
  
  /// @notice Sell token amount 
  function sell(address token, uint baseAmount) public returns (uint quoteAmount) {
    require(baseAmount > 0, "Swap: Invalid sell amount");
    require(balances[token].quoteBalance > 0, "Swap: Cannot sell this token");
    // distribute jackpots: first hourly, then the daily (may impact the daily winner )))
    distributeJackpots();
    // set yesterday's close if necessary
    if (tokenDailyCloses[token][today()-1] == 0) _setDailyClose(token, today() - 1); 
    ERC20(token).transferFrom(msg.sender, address(this), baseAmount);
    uint quoteAmountBeforeFee = getAmountSale(token, baseAmount);
    balances[token].baseBalance += baseAmount;
    balances[token].quoteBalance -= quoteAmountBeforeFee;
    _incTokenVolume(token, quoteAmountBeforeFee);
    
    uint _tradingFee = quoteAmountBeforeFee * tradingFee / 1e4;
    uint _treasuryFee = quoteAmountBeforeFee * treasuryFee / 1e4;
    quoteAmount  = quoteAmountBeforeFee - _tradingFee - _treasuryFee;
    _depositJackpots(_tradingFee);
    (bool success, ) = payable(treasury).call{value: _treasuryFee}("");
    require(success, "Swap: Error sending quote fee");
    (success, ) = payable(msg.sender).call{value: quoteAmount}("");
    require(success, "Swap: Error sending quote");

    _setDailyClose(token, today());
    emit Sell(msg.sender, token, baseAmount, quoteAmount);
  }
  
  
  ///////////////// EJECT TO AMM
  
  /**
    When the mcap of the token reaches `mcapToAmm`, half of the liquidity is deposited in an AMM
    Will fail if the AMM pool already exists with a different price: handle externally (arb it back to proper price)
  */
  function ejectToAmm(address token) public {
    require(getMcap(token) > mcapToAmm, "Insufficient Mcap");
    uint price = getPrice(token);
    uint quoteAmount = balances[token].quoteBalance;
    uint baseAmount = quoteAmount * 1e18 / price;
    
    ERC20(token).approve(ammRouter, baseAmount);
    (uint amountToken, uint amountETH, uint liquidity) = IUniswapV2Router(ammRouter).addLiquidityETH{value: quoteAmount}(
      token,
      baseAmount,
      baseAmount * 99 / 100,
      quoteAmount * 99 / 100,
      address(this),
      block.timestamp
    );
    // if there is remaining quote non deposited, gift it to the jackpot
    if (amountETH < balances[token].quoteBalance) _depositJackpots(balances[token].quoteBalance - amountETH);
    // burn remaining unsold supply
    if (balances[token].baseBalance - amountToken > 0) Token(token).burn(balances[token].baseBalance - amountToken);
    // reset balances, which makes the token non tradable
    balances[token].quoteBalance = 0;
    balances[token].baseBalance = 0;
    
    emit Ejected(token, amountToken, amountETH);
  }
  
  
  ///////////////// LOTTERY FUNCTIONS
  /**
    Lottery happens daily, expires at 0 UTC. Tickets are bought at day d, with expiry at d+1
    First ticket purchase defines next day's lottery parameters: strike & payout per ticket
    When first ticket purchase, strike is set at 5x.
    Bc at 5x the user has made 100x, the payout is 20x the current token price
  */
  /// @notice Buy lottery ticket
  /// @dev Ticket expire end of next day and premiums are in next day's jackpot
  function buyTicket(address token) public payable returns (uint payout, uint strike) {
    require(isLotteryRunning, "100xOrBust: Not running");
    require(msg.value > 0, "100xOrBust: Invalid amount");
    require(getMcap(token) > lotteryThreshold, "100xOrBust: Insufficient Mcap");
    uint32 round = today() + 1;
    _setDailyClose(token, today()); // set today's close so we guarantee a value is available

    // 1. check lottery parameters (price non 0 since mcap > 10k)
    uint price = getPrice(token);
    strike = tokenDailyLotterySettings[token][round].strike;
    // init if lottery not started for that token+day

    if (strike == 0) {
      strike = price * 5;
      tokenDailyLotterySettings[token][round].strike = strike;
      tokenDailyLotterySettings[token][round].payoutPerTicket = 1e36 / price * 20;
    }
    // 2. calculate potential payout
    payout = tokenDailyLotterySettings[token][round].payoutPerTicket * msg.value / 1e18;
    
    // 3. set OI
    tokenDailyLotteryUserBalances[token][round][msg.sender] = payout;
    tokenDailyLotterySettings[token][round].totalOI += payout;
    require(tokenDailyLotterySettings[token][round].totalOI < ERC20(token).totalSupply() / 20);

    uint _treasuryFee = msg.value * treasuryFee / 1e4;
    (bool success, ) = payable(treasury).call{value: _treasuryFee}("");
    require(success, "100xOrBust: Error sending quote fee");
    dailyJackpot[round] += msg.value - _treasuryFee;
    emit BuyTicket(msg.sender, token, msg.value, round);
  }
  
  
  /// @notice Claim lottery payout: tokens are minted
  /// @dev Can only claim the previous, after which rewards are lost
  function claim(address token) public returns (uint payout) {
    uint32 round = today() - 1;
    payout = tokenDailyLotteryUserBalances[token][round][msg.sender];
    // if there is OI there is a price since we set price during ticket sale
    if (payout > 0){
      uint strike = tokenDailyLotterySettings[token][round].strike;
      if (tokenDailyCloses[token][round] >= strike) {
        Token(token).mint(msg.sender, payout);
        tokenDailyLotteryUserBalances[token][round][msg.sender] = 0; // no dual claim pls
        emit WinningClaim(msg.sender, token, payout);
      }
      else payout = 0;
    }
  }
  
  
  ///////////////// VOLUME JACKPOT
  
  /// @notice Add trading volume and update the hourly leader
  function _incTokenVolume(address token, uint amount) internal {
    tokenHourlyVolume[token][hhour()] += amount;
    uint volume = tokenHourlyVolume[token][hhour()];
    // new leader!
    if (volume >= tokenHourlyVolume[hourlyVolumeLeader[hhour()]][hhour()])
      hourlyVolumeLeader[hhour()] = token;
    tokenDailyVolume[token][today()] += amount;
    volume = tokenDailyVolume[token][today()];
    _updateTop3(token, volume);
  }
  
  
  /// @notice Distribute the hourly jackpot 
  /// @dev Can retroactively distribute 
  /// @dev Cannot have a jackpot and no winner by design
  function distributeHourlyJackpot(uint32 _hhour) public returns (address winner, uint jackpot) {
    require(_hhour < hhour(), "HJ: Round ongoing");
    if(!isDistributedHourlyJackpot[_hhour]){
      winner = hourlyVolumeLeader[_hhour];
      jackpot = _distributeRewards(winner, hourlyJackpot[_hhour]);
      isDistributedHourlyJackpot[_hhour] = true;
      emit HourlyJackpot(winner, jackpot, tokenHourlyVolume[winner][_hhour]);
    }
  }
  
  
  /// @notice Lottery settlement: pick the winners and split the jackpot
  /// @dev Split the jackpot between top 3, deposit 60-30-10% directly in the pair AMM accounting
  /// @dev Specify a previous jackpot in case nobody traded some day to avoid losing funds
  function distributeDailyJackpot(uint32 round) public {
    require(round < today(), "DJ: Round ongoing");
    if (!isDistributedDailyJackpot[round] && dailyJackpot[round] > 0){
      uint jackpot = dailyJackpot[round];
      uint distributed;
      address[3] memory winners = dailyVolumeLeaders[round];
      uint8[3] memory payouts = [60, 30, 10];
      // 40% for token 1 winner etc.
      // note: rounding errors may lead in few weis lost, ignore
      for (uint8 k; k<3; k++)
        distributed += _distributeRewards(winners[k], jackpot * payouts[k] / 100);
      // if some rewards not distributed, e.g there's no winner token, roll over rewards to next active round (today)
      if (distributed < jackpot) dailyJackpot[today()] += jackpot - distributed;
      isDistributedDailyJackpot[round] = true;
    }
  }
  
  /// @notice Distribute jackpots
  function distributeJackpots() public {
    distributeHourlyJackpot(hhour() - 1);
    distributeDailyJackpot(today() - 1);
  }
  
  /// @notice Keep track of top 3 (for next round)
  /// @dev careful the total OI tracked is in base, while the top3 is in quote, need to div totalOi / payoutPerTicket 
  function _updateTop3(address token, uint volume) internal {
    uint32 round = today();
    address[3] memory top = dailyVolumeLeaders[round];
    // if volume below top 3, nothing to sort
    if (volume < tokenDailyVolume[top[2]][round]) return;
    // if not already in top 3, insert in last position
    if (token != top[0] && token != top[1] && token != top[2]) dailyVolumeLeaders[round][2] = token;
    // bubble sort: because only 1 item may be in the wrong place (too low), starting from bottom and single pass is enough
    _sort2by2(1, 2);
    _sort2by2(0, 1);
  }
  /// @notice Sort 2 top3 items together (item 0 should be higher volume)
  function _sort2by2(uint8 rank0, uint8 rank1) internal {
    uint32 round = today();
    address leader0 = dailyVolumeLeaders[round][rank0];
    address leader1 = dailyVolumeLeaders[round][rank1];
    if (tokenDailyVolume[leader0][round] < tokenDailyVolume[leader1][round]) {
      dailyVolumeLeaders[round][rank0] = leader1;
      dailyVolumeLeaders[round][rank1] = leader0;
    }
  }
  
  /// @notice Split fees in the jackpots
  function _depositJackpots(uint amount) internal {
    hourlyJackpot[hhour()] += amount / 2;
    dailyJackpot[today()] += amount - amount / 2;
  }
  function depositJackpots() public payable {
    _depositJackpots(msg.value);
  }
  
  ///////////////// VARIOUS
  
  /// @notice Set daily close
  function _setDailyClose(address token, uint32 round) internal {
    uint price = getPrice(token);
    tokenDailyCloses[token][round] = price;
  }
  
  /// @notice Today 
  function today() public view returns (uint32) {
    return uint32(block.timestamp / 86400);
  }
  
  /// @notice Current hhour
  function hhour() public view returns (uint32){
    return uint32(block.timestamp / 3600);
  }
  
  /// @notice Distribute some rewards to a token: buy and burn
  function _distributeRewards(address token, uint quoteAmount) internal returns (uint distributed) {
    if (token != address(0) && quoteAmount != 0){
      uint baseAmount = getBuyAmount(token, quoteAmount);
      balances[token].baseBalance -= baseAmount;
      balances[token].quoteBalance += quoteAmount;
      distributed = quoteAmount;
      Token(token).burn(baseAmount);
    }
  }
}