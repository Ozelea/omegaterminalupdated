import asyncio
import websockets
import json
import numpy as np
import pandas as pd
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime, timedelta
import logging
from collections import deque
import pickle
import os
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error
import math
from hyperliquid.info import Info
from hyperliquid.exchange import Exchange
from hyperliquid.utils import constants
from eth_account import Account
import time
import statistics

# Configure logging with UTF-8 encoding for Windows
import sys
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('hyperliquid_advanced_bot.log', encoding='utf-8'),
        logging.StreamHandler(sys.stdout)
    ]
)

# Set console to handle UTF-8 on Windows
if sys.platform == 'win32':
    try:
        import locale
        locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')
    except:
        pass
logger = logging.getLogger(__name__)

@dataclass
class MarketData:
    symbol: str
    price: float
    timestamp: datetime
    volume: float
    bid: float
    ask: float
    spread: float

@dataclass
class TradingSignal:
    symbol: str
    direction: str  # 'long' or 'short'
    confidence: float
    entry_price: float
    stop_loss: float
    take_profit: float
    risk_score: float
    strategy_used: str

@dataclass
class Position:
    symbol: str
    side: str
    size: float
    entry_price: float
    current_price: float
    unrealized_pnl: float
    timestamp: datetime

class AdvancedMathematicalModels:
    """
    Doctorate-level mathematical models for trading analysis
    """
    
    @staticmethod
    def _calculate_ema(prices: np.array, period: int) -> np.array:
        """Calculate Exponential Moving Average manually"""
        if len(prices) < period:
            return np.array([])
        
        alpha = 2.0 / (period + 1)
        ema = np.zeros_like(prices)
        ema[0] = prices[0]
        
        for i in range(1, len(prices)):
            ema[i] = alpha * prices[i] + (1 - alpha) * ema[i-1]
        
        return ema
    
    @staticmethod
    def bollinger_bands_probability(prices: List[float], period: int = 20) -> Dict:
        """Calculate Bollinger Bands with statistical probability analysis"""
        if len(prices) < period:
            return {}
        
        prices_array = np.array(prices)
        sma = np.mean(prices_array[-period:])
        std = np.std(prices_array[-period:])
        
        upper_band = sma + (2 * std)
        lower_band = sma - (2 * std)
        current_price = prices[-1]
        
        # Calculate Z-score for probability analysis
        z_score = (current_price - sma) / std if std > 0 else 0
        
        # Normal distribution probability
        probability_above = 1 - (0.5 * (1 + math.erf(z_score / math.sqrt(2))))
        
        return {
            'upper_band': upper_band,
            'lower_band': lower_band,
            'sma': sma,
            'z_score': z_score,
            'probability_reversal': probability_above if z_score > 0 else 1 - probability_above,
            'volatility_ratio': std / sma if sma > 0 else 0
        }
    
    @staticmethod
    def fractal_dimension(prices: List[float]) -> float:
        """Calculate Hurst Exponent for trend persistence analysis"""
        if len(prices) < 10:
            return 0.5
        
        prices_array = np.array(prices)
        log_returns = np.diff(np.log(prices_array))
        
        # Calculate variance of log returns
        var_log_returns = np.var(log_returns)
        
        # Calculate rescaled range
        periods = [2, 4, 8, 16, min(32, len(log_returns)//2)]
        rs_values = []
        
        for period in periods:
            if period >= len(log_returns):
                continue
                
            segments = len(log_returns) // period
            rs_segment = []
            
            for i in range(segments):
                segment = log_returns[i*period:(i+1)*period]
                mean_segment = np.mean(segment)
                cumulative_deviations = np.cumsum(segment - mean_segment)
                range_segment = np.max(cumulative_deviations) - np.min(cumulative_deviations)
                std_segment = np.std(segment)
                
                if std_segment > 0:
                    rs_segment.append(range_segment / std_segment)
            
            if rs_segment:
                rs_values.append((period, np.mean(rs_segment)))
        
        if len(rs_values) < 2:
            return 0.5
        
        # Linear regression to find Hurst exponent
        periods_log = [math.log(x[0]) for x in rs_values]
        rs_log = [math.log(x[1]) if x[1] > 0 else 0 for x in rs_values]
        
        if len(periods_log) > 1:
            slope = np.polyfit(periods_log, rs_log, 1)[0]
            return min(max(slope, 0), 1)  # Clamp between 0 and 1
        
        return 0.5
    
    @staticmethod
    def momentum_oscillator(prices: List[float], period: int = 14) -> Dict:
        """Advanced momentum analysis with multiple timeframes"""
        if len(prices) < period * 2:
            return {}
        
        prices_array = np.array(prices)
        
        # RSI calculation
        deltas = np.diff(prices_array)
        gains = np.where(deltas > 0, deltas, 0)
        losses = np.where(deltas < 0, -deltas, 0)
        
        avg_gains = np.convolve(gains, np.ones(period)/period, mode='valid')
        avg_losses = np.convolve(losses, np.ones(period)/period, mode='valid')
        
        rs = avg_gains / (avg_losses + 1e-10)
        rsi = 100 - (100 / (1 + rs))
        
        # MACD calculation (manual implementation)
        ema12 = AdvancedMathematicalModels._calculate_ema(prices_array, 12)
        ema26 = AdvancedMathematicalModels._calculate_ema(prices_array, 26)
        macd = ema12 - ema26
        signal = AdvancedMathematicalModels._calculate_ema(macd, 9)
        histogram = macd - signal
        
        return {
            'rsi': rsi[-1] if len(rsi) > 0 else 50,
            'macd': macd[-1] if len(macd) > 0 else 0,
            'macd_signal': signal[-1] if len(signal) > 0 else 0,
            'macd_histogram': histogram[-1] if len(histogram) > 0 else 0,
            'momentum_strength': abs(histogram[-1]) if len(histogram) > 0 else 0
        }

class MachineLearningEngine:
    """
    Advanced ML engine for adaptive trading strategies
    """
    
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.feature_history = {}
        self.performance_history = {}
        self.model_file = 'ml_models.pkl'
        self.load_models()
    
    def prepare_features(self, market_data_history: List[MarketData], symbol: str) -> np.array:
        """Prepare feature vector for ML model"""
        if len(market_data_history) < 50:
            return np.array([])
        
        # Extract price series
        prices = [md.price for md in market_data_history[-50:]]
        volumes = [md.volume for md in market_data_history[-50:]]
        spreads = [md.spread for md in market_data_history[-50:]]
        
        # Technical indicators
        math_models = AdvancedMathematicalModels()
        bb_data = math_models.bollinger_bands_probability(prices)
        momentum_data = math_models.momentum_oscillator(prices)
        hurst = math_models.fractal_dimension(prices)
        
        # Price-based features
        returns = np.diff(prices) / prices[:-1]
        volatility = np.std(returns) if len(returns) > 1 else 0
        price_change_1 = (prices[-1] - prices[-2]) / prices[-2] if len(prices) > 1 else 0
        price_change_5 = (prices[-1] - prices[-6]) / prices[-6] if len(prices) > 5 else 0
        price_change_10 = (prices[-1] - prices[-11]) / prices[-11] if len(prices) > 10 else 0
        
        # Volume analysis
        volume_ratio = volumes[-1] / np.mean(volumes[:-1]) if len(volumes) > 1 else 1
        volume_trend = np.polyfit(range(len(volumes)), volumes, 1)[0] if len(volumes) > 2 else 0
        
        # Spread analysis
        spread_ratio = spreads[-1] / np.mean(spreads[:-1]) if len(spreads) > 1 else 1
        
        # Time-based features
        hour = market_data_history[-1].timestamp.hour
        minute = market_data_history[-1].timestamp.minute
        
        features = [
            price_change_1, price_change_5, price_change_10,
            volatility, volume_ratio, volume_trend, spread_ratio,
            bb_data.get('z_score', 0), bb_data.get('probability_reversal', 0.5),
            bb_data.get('volatility_ratio', 0),
            momentum_data.get('rsi', 50), momentum_data.get('macd', 0),
            momentum_data.get('macd_histogram', 0), momentum_data.get('momentum_strength', 0),
            hurst, hour, minute
        ]
        
        return np.array(features).reshape(1, -1)
    
    def train_model(self, symbol: str, features_history: List, targets: List):
        """Train ML model for specific symbol"""
        if len(features_history) < 10:
            return
        
        X = np.array(features_history)
        y = np.array(targets)
        
        # Initialize scaler if not exists
        if symbol not in self.scalers:
            self.scalers[symbol] = StandardScaler()
        
        X_scaled = self.scalers[symbol].fit_transform(X)
        
        # Use ensemble of models
        rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
        gb_model = GradientBoostingRegressor(n_estimators=100, random_state=42)
        
        rf_model.fit(X_scaled, y)
        gb_model.fit(X_scaled, y)
        
        self.models[symbol] = {
            'rf': rf_model,
            'gb': gb_model,
            'last_trained': datetime.now()
        }
        
        # Save models
        self.save_models()
        
        logger.info(f"Trained ML models for {symbol} with {len(features_history)} samples")
    
    def predict(self, symbol: str, features: np.array) -> Tuple[float, float]:
        """Predict price movement and confidence"""
        if symbol not in self.models or len(features) == 0:
            return 0.0, 0.0
        
        if symbol not in self.scalers:
            return 0.0, 0.0
        
        try:
            features_scaled = self.scalers[symbol].transform(features)
            
            rf_pred = self.models[symbol]['rf'].predict(features_scaled)[0]
            gb_pred = self.models[symbol]['gb'].predict(features_scaled)[0]
            
            # Ensemble prediction
            prediction = (rf_pred + gb_pred) / 2
            
            # Calculate confidence based on model agreement
            confidence = 1.0 - abs(rf_pred - gb_pred) / (abs(rf_pred) + abs(gb_pred) + 1e-10)
            confidence = min(max(confidence, 0.0), 1.0)
            
            return prediction, confidence
        except Exception as e:
            logger.error(f"ML prediction error for {symbol}: {e}")
            return 0.0, 0.0
    
    def update_performance(self, symbol: str, predicted: float, actual: float):
        """Update model performance tracking"""
        if symbol not in self.performance_history:
            self.performance_history[symbol] = deque(maxlen=100)
        
        error = abs(predicted - actual)
        self.performance_history[symbol].append(error)
        
        # Retrain if performance degrades
        if len(self.performance_history[symbol]) >= 20:
            recent_error = np.mean(list(self.performance_history[symbol])[-10:])
            overall_error = np.mean(list(self.performance_history[symbol]))
            
            if recent_error > overall_error * 1.5:
                logger.info(f"Performance degraded for {symbol}, scheduling retrain")
                # Could trigger retraining here
    
    def save_models(self):
        """Save ML models to disk"""
        try:
            with open(self.model_file, 'wb') as f:
                pickle.dump({
                    'models': self.models,
                    'scalers': self.scalers,
                    'performance_history': dict(self.performance_history)
                }, f)
        except Exception as e:
            logger.error(f"Error saving models: {e}")
    
    def load_models(self):
        """DISABLED - Using simple momentum strategy instead"""
        logger.info("🔄 HULL MA STRATEGY - No ML models needed!")

class HyperliquidAdvancedBot:
    """
    Advanced Hyperliquid trading bot with doctorate-level mathematical analysis
    """
    
    def __init__(self):
        # HULL MOVING AVERAGE STRATEGY (from Pine Script) - ADJUSTED FOR $504 ACCOUNT
        self.symbols = ["BTC", "ETH", "SOL"]  
        self.stop_loss_pct = 0.02    # 2% stop loss (as requested)
        self.take_profit_pct = 20    # $20 profit target (10% ROE on $200 margin)
        self.data_points_per_symbol = 50   # REDUCED: 50 periods (realistic for live trading)
        self.total_data_points_target = 150  # 3 tokens × 50 points = 5-10 minutes
        
        # Hull MA Strategy Parameters (ADJUSTED for live trading)
        self.decision_threshold = 0.0010  # "dt" parameter
        self.hull_period = 7              # "Wow" parameter  
        self.wma1_period = 21             # Reduced from 34
        self.wma2_period = 50             # Reduced from 144  
        self.wma3_period = 50             # Reduced from 377 (same as requirement)
        self.position_size_pct = 1.50     # 150% of equity (use full margin + some leverage)
        
        # MAXIMUM AGGRESSION STRATEGY 
        self.max_positions = 2            # 2 BIG positions ($250 margin each = $500 total = 99% utilization)
        
        # LIVE TRADING MODE - All fixes implemented
        self.paper_trading_mode = False  # LIVE TRADING ENABLED
        
        # Force live trading mode (override any cache issues)
        assert self.paper_trading_mode == False, "Paper trading should be disabled!"
        
        # Data buffering for batch processing
        self.data_buffer = {symbol: [] for symbol in self.symbols}
        self.buffer_size = 5  # Process every 5 data points
        self.last_batch_process = {symbol: time.time() for symbol in self.symbols}
        
        # Hyperliquid configuration - USER INPUT
        self.private_key = None
        self.wallet = None
        self.info = None
        self.exchange = None
        
        # User will be prompted for these during startup
        self.user_config = {
            'private_key': None,
            'symbols': [],
            'stop_loss_pct': 0.02,
            'take_profit_target': 20,
            'trading_strategy': 'hull_ma',
            'position_size_pct': 1.0,
            'max_positions': 2
        }
        
        # Data storage
        self.market_data_history = {symbol: deque(maxlen=200) for symbol in self.symbols}
        self.current_positions = {}
        self.trading_signals = deque(maxlen=1000)
        
        # DISABLED ML Engine (using simple momentum instead)
        # self.ml_engine = MachineLearningEngine()
        
        # Performance tracking
        self.total_trades = 0
        self.profitable_trades = 0
        self.total_pnl = 0.0
        self.data_collection_complete = False
        
        # HULL MA: Quality over quantity signals
        self.recent_signals = {symbol: [] for symbol in self.symbols}
        self.signal_history_length = 3  # Standard for Hull MA confirmation
        self.last_trade_time = {symbol: 0 for symbol in self.symbols}
        self.trade_cooldown = 15  # 15 seconds between trades (MAXIMUM AGGRESSION)
        
        # Incremental Learning & Risk Management
        self.model_retrain_interval = 100  # Retrain every 100 data points (less frequent)
        self.market_condition = "normal"  # normal, volatile, trending
        self.volatility_threshold = 0.02  # 2% volatility threshold
        
        # Retry mechanisms
        self.max_retries = 3
        self.retry_delay = 1  # seconds
        
        # WebSocket connection
        self.ws_url = "wss://api.hyperliquid.xyz/ws"
        self.is_running = False
        
        logger.info("🤖 HYPERLIQUID TRADING BOT STARTING...")
        logger.info("⚙️ USER CONFIGURATION REQUIRED")
        logger.info("🔧 Bot will prompt for settings before trading")
        
        # User configuration will be set during run()
        self.config_complete = False
    
    def verify_account_connection(self):
        """Verify we can connect to the account and see balances"""
        try:
            logger.info(f"Wallet Address: {self.wallet.address}")
            
            # Check user state
            user_state = self.info.user_state(self.wallet.address)
            logger.info(f"Account connection test: {user_state}")
            
            if user_state:
                # Try to get account value
                account_value = float(user_state.get('marginSummary', {}).get('accountValue', 0))
                logger.info(f"Account Value: ${account_value:.2f}")
                
                # Check positions
                positions = user_state.get('assetPositions', [])
                logger.info(f"Current positions: {len(positions)}")
                for pos in positions:
                    logger.info(f"  Position: {pos}")
            else:
                logger.warning("Could not retrieve user state - check network/API configuration")
                
        except Exception as e:
            logger.error(f"Account verification failed: {e}")
    
    async def connect_websocket(self):
        """Connect to Hyperliquid WebSocket with retry mechanism"""
        subscription = {
            "method": "subscribe",
            "subscription": {
                "type": "allMids"
            }
        }
        
        retry_count = 0
        while self.is_running:
            try:
                async with websockets.connect(
                    self.ws_url, 
                    ping_interval=30,  # Keep connection alive
                    close_timeout=10
                ) as websocket:
                    await websocket.send(json.dumps(subscription))
                    logger.info("Connected to Hyperliquid WebSocket")
                    retry_count = 0  # Reset on successful connection
                    
                    async for message in websocket:
                        if not self.is_running:
                            break
                        
                        try:
                            data = json.loads(message)
                            await self.process_market_data(data)
                        except Exception as e:
                            # Silent fail for individual message errors
                            pass
                            
            except Exception as e:
                retry_count += 1
                wait_time = min(60, self.retry_delay * (2 ** min(retry_count, 6)))  # Cap at 60 seconds
                
                if retry_count <= self.max_retries or retry_count % 10 == 0:  # Log occasionally
                    logger.warning(f"🔌 WebSocket disconnected (attempt {retry_count}), retrying in {wait_time}s...")
                
                if self.is_running:
                    await asyncio.sleep(wait_time)
    
    async def process_market_data(self, data: Dict):
        """Process incoming market data with buffering and batch processing"""
        if data.get("channel") != "allMids":
            return
        
        mids = data.get("data", {}).get("mids", {})
        current_time = time.time()
        
        for symbol_key, price_str in mids.items():
            # Extract symbol name (remove any suffix)
            symbol = symbol_key.split('@')[0] if '@' in symbol_key else symbol_key
            
            if symbol not in self.symbols:
                continue
            
            try:
                price = float(price_str)
                timestamp = datetime.now()
                
                # WebSocket-only mode - calculate metrics without API calls
                market_info = await self.calculate_market_metrics(symbol, price)
                
                market_data = MarketData(
                    symbol=symbol,
                    price=price,
                    timestamp=timestamp,
                    volume=market_info.get('volume', 1000),
                    bid=market_info.get('bid', price),
                    ask=market_info.get('ask', price),
                    spread=market_info.get('spread', 0)
                )
                
                # Add to buffer for batch processing
                self.data_buffer[symbol].append(market_data)
                
                # Process buffer when it reaches target size or time threshold
                time_since_last = current_time - self.last_batch_process[symbol]
                
                if (len(self.data_buffer[symbol]) >= self.buffer_size or 
                    time_since_last > 5):  # Process every 5 seconds max
                    
                    await self.process_data_batch(symbol)
                    self.last_batch_process[symbol] = current_time
                
            except Exception as e:
                # Reduce logging spam - only log critical errors
                if "429" not in str(e):  # Don't log rate limit errors
                    pass  # Silent fail for non-critical errors
    
    async def calculate_market_metrics(self, symbol: str, price: float) -> Dict:
        """Calculate market metrics from WebSocket data only - No API calls"""
        try:
            # WebSocket-only mode - calculate metrics from price data
            bid = price * 0.9995  # Tight spread approximation
            ask = price * 1.0005  # Tight spread approximation
            spread = ask - bid
            
            # Estimate volume based on price movement frequency
            volume = 1000  # Default volume estimate
            if symbol in self.market_data_history and len(self.market_data_history[symbol]) > 10:
                # Estimate volume based on price volatility
                recent_prices = [md.price for md in list(self.market_data_history[symbol])[-10:]]
                volatility = np.std(recent_prices) / np.mean(recent_prices) if recent_prices else 0
                volume = max(500, min(5000, 1000 * (1 + volatility * 10)))
            
            return {
                'volume': volume,
                'bid': bid,
                'ask': ask,
                'spread': spread
            }
        except Exception as e:
            # Minimal logging to reduce spam
            return {'volume': 1000, 'bid': price * 0.9995, 'ask': price * 1.0005, 'spread': price * 0.001}
    
    async def process_data_batch(self, symbol: str):
        """Process buffered data in batches for efficiency"""
        if not self.data_buffer[symbol]:
            return
        
        # Move buffered data to main history
        for market_data in self.data_buffer[symbol]:
            self.market_data_history[symbol].append(market_data)
        
        # Clear buffer after processing
        buffer_size = len(self.data_buffer[symbol])
        self.data_buffer[symbol].clear()
        
        # Check data collection status
        if not self.data_collection_complete:
            await self.check_data_collection_status()
        
        # Analyze market conditions for real-time adaptation
        await self.analyze_market_conditions(symbol)
        
        # Generate trading signals if ready
        if self.data_collection_complete:
            await self.analyze_and_trade(symbol)
        
        # Incremental learning - retrain models periodically
        if self.total_trades > 0 and self.total_trades % self.model_retrain_interval == 0:
            await self.incremental_model_training(symbol)
    
    async def analyze_market_conditions(self, symbol: str):
        """Analyze market conditions for real-time adaptation"""
        if len(self.market_data_history[symbol]) < 20:
            return
        
        # Calculate recent volatility
        recent_prices = [md.price for md in list(self.market_data_history[symbol])[-20:]]
        volatility = np.std(recent_prices) / np.mean(recent_prices) if recent_prices else 0
        
        # Update market condition
        if volatility > self.volatility_threshold:
            self.market_condition = "volatile"
        elif volatility < self.volatility_threshold / 2:
            # Check for trending market
            price_change = (recent_prices[-1] - recent_prices[0]) / recent_prices[0]
            if abs(price_change) > 0.02:  # 2% move
                self.market_condition = "trending"
            else:
                self.market_condition = "normal"
        else:
            self.market_condition = "normal"
    
    async def check_data_collection_status(self):
        """Check if we have collected enough data points (50 per symbol)"""
        total_collected = sum(len(history) for history in self.market_data_history.values())
        
        if total_collected >= self.total_data_points_target:
            self.data_collection_complete = True
            strategy_name = self.user_config.get('trading_strategy', 'hull_ma').replace('_', ' ').title()
            logger.info(f"🔄 {strategy_name.upper()} STRATEGY READY! Collected {total_collected} data points")
            logger.info(f"📊 Data breakdown: {', '.join([f'{s}={len(self.market_data_history[s])}' for s in self.symbols])}")
            await self.initial_ml_training()
    
    async def initial_ml_training(self):
        """Strategy initialization complete"""
        strategy_name = self.user_config.get('trading_strategy', 'hull_ma').replace('_', ' ').title()
        logger.info(f"🔄 {strategy_name.upper()} INDICATORS CALCULATED - Ready for trading!")
    
    async def incremental_model_training(self, symbol: str):
        """DISABLED - Using simple momentum strategy instead"""
        pass  # No retraining needed for momentum scalping
    
    async def train_symbol_model(self, symbol: str):
        """Train ML model for a specific symbol with retry mechanism"""
        for attempt in range(self.max_retries):
            try:
                # Prepare training data
                features_list = []
                targets = []
                
                history = list(self.market_data_history[symbol])
                min_history = min(15, len(history) - 5)  # Reduced from 20
                
                for i in range(min_history, len(history) - 3):  # Reduced lookahead from 5 to 3
                    features = self.ml_engine.prepare_features(history[:i+1], symbol)
                    if len(features) > 0:
                        features_list.append(features[0])
                        
                        # Target: future price change (3 steps ahead)
                        current_price = history[i].price
                        future_price = history[i+3].price
                        price_change = (future_price - current_price) / current_price
                        targets.append(price_change)
                
                if len(features_list) >= 5:  # Reduced minimum from 10 to 5
                    self.ml_engine.train_model(symbol, features_list, targets)
                    return  # Success, exit retry loop
                
            except Exception as e:
                if attempt < self.max_retries - 1:
                    await asyncio.sleep(self.retry_delay * (2 ** attempt))  # Exponential backoff
                else:
                    # Only log after all retries failed
                    logger.warning(f"⚠️ Model training failed for {symbol} after {self.max_retries} attempts")
    
    async def analyze_and_trade(self, symbol: str):
        """Analyze market data and execute trades"""
        if len(self.market_data_history[symbol]) < 50:
            return
        
        try:
            # Get current market data
            current_data = self.market_data_history[symbol][-1]
            
            # Generate trading signal
            signal = await self.generate_trading_signal(symbol)
            
            if signal and signal.confidence > 0.6:  # Only trade high-confidence signals
                await self.execute_trade(signal)
                
        except Exception as e:
            logger.error(f"Error in analyze_and_trade for {symbol}: {e}")
    
    def calculate_wma(self, prices: List[float], period: int) -> float:
        """Calculate Weighted Moving Average"""
        if len(prices) < period:
            return 0.0
        
        recent_prices = prices[-period:]
        weights = list(range(1, period + 1))
        weighted_sum = sum(price * weight for price, weight in zip(recent_prices, weights))
        weight_sum = sum(weights)
        return weighted_sum / weight_sum
    
    def calculate_hull_ma(self, prices: List[float], period: int) -> tuple:
        """Calculate Hull Moving Average components (n1, n2)"""
        if len(prices) < period + 2:
            return 0.0, 0.0
        
        # Current Hull MA calculation
        half_period = round(period / 2)
        sqrt_period = round(np.sqrt(period))
        
        n2ma = 2 * self.calculate_wma(prices, half_period)
        nma = self.calculate_wma(prices, period)
        diff = n2ma - nma
        n1 = self.calculate_wma([diff] * sqrt_period, sqrt_period) if diff != 0 else 0
        
        # Previous Hull MA calculation (2 periods ago)
        prices_prev = prices[:-2]
        if len(prices_prev) >= period:
            n2ma_prev = 2 * self.calculate_wma(prices_prev, half_period)
            nma_prev = self.calculate_wma(prices_prev, period)
            diff_prev = n2ma_prev - nma_prev
            n2 = self.calculate_wma([diff_prev] * sqrt_period, sqrt_period) if diff_prev != 0 else 0
        else:
            n2 = 0.0
            
        return n1, n2

    async def generate_trading_signal(self, symbol: str) -> Optional[TradingSignal]:
        """Generate trading signal based on user-selected strategy"""
        try:
            history = list(self.market_data_history[symbol])
            if len(history) < 50:  # Need at least 50 data points as requested
                return None
            
            current_price = history[-1].price
            previous_price = history[-2].price if len(history) >= 2 else current_price
            prices = [md.price for md in history]
            
            # Route to appropriate strategy
            strategy = self.user_config.get('trading_strategy', 'hull_ma')
            
            if strategy == 'hull_ma':
                return await self.hull_ma_strategy(symbol, prices, current_price, previous_price)
            elif strategy == 'momentum':
                return await self.momentum_strategy(symbol, prices, current_price, previous_price)
            elif strategy == 'mean_reversion':
                return await self.mean_reversion_strategy(symbol, prices, current_price, previous_price)
            elif strategy == 'breakout':
                return await self.breakout_strategy(symbol, prices, current_price, previous_price)
            else:
                # Default to Hull MA
                return await self.hull_ma_strategy(symbol, prices, current_price, previous_price)
                
        except Exception as e:
            logger.error(f"Signal generation error for {symbol}: {e}")
            return None
    
    async def hull_ma_strategy(self, symbol: str, prices: List[float], current_price: float, previous_price: float) -> Optional[TradingSignal]:
        """Hull Moving Average Strategy (Original)"""
        if len(prices) < max(self.wma1_period, self.wma2_period, self.wma3_period):
            return None
        
        # === WEIGHTED MOVING AVERAGES ===
        wma1 = self.calculate_wma(prices, self.wma1_period)   # 21-period
        wma2 = self.calculate_wma(prices, self.wma2_period)   # 50-period  
        wma3 = self.calculate_wma(prices, self.wma3_period)   # 50-period
        
        # === HULL MOVING AVERAGE MOMENTUM ===
        n1, n2 = self.calculate_hull_ma(prices, self.hull_period)
        
        # === TREND CONDITIONS ===
        price_rising = current_price > previous_price
        price_falling = current_price < previous_price
        hull_bullish = n1 > n2
        hull_bearish = n2 > n1
        
        # === ENTRY CONDITIONS ===
        long_condition = price_rising and hull_bullish
        short_condition = price_falling and hull_bearish
            
            # === POSITION MANAGEMENT ===
            if symbol in self.current_positions:
                position = self.current_positions[symbol]
                
                # EXIT CONDITIONS with 2% stop loss OR profit target OR trend reversal
                pnl_dollar = position.unrealized_pnl
                
                # Stop loss check (2%)
                loss_threshold = -0.02 * (position.entry_price * position.size)
                
                close_long = (position.side == "long" and 
                             (price_falling and hull_bearish and pnl_dollar > self.take_profit_pct) or
                             pnl_dollar <= loss_threshold)
                
                close_short = (position.side == "short" and
                              (price_rising and hull_bullish and pnl_dollar > self.take_profit_pct) or  
                              pnl_dollar <= loss_threshold)
                
                if close_long or close_short:
                    reason = "2% Stop Loss" if pnl_dollar <= loss_threshold else "Hull MA Reversal + Profit"
                    await self.close_position(symbol, position, reason)
                    return None
                else:
                    return None  # Already have position, no exit condition met
        
        # === NEW ENTRY SIGNALS ===
        if long_condition:
            direction = "long"
            confidence = 0.8  # High confidence for Hull MA signals
        elif short_condition:
            direction = "short"  
            confidence = 0.8
        else:
            return None  # No clear signal
        
        # === RISK MANAGEMENT ===
        if direction == "long":
            stop_loss = current_price * (1 - self.stop_loss_pct)
            take_profit = current_price + (self.take_profit_pct / (current_price * self.position_size_pct))
        else:
            stop_loss = current_price * (1 + self.stop_loss_pct)
            take_profit = current_price - (self.take_profit_pct / (current_price * self.position_size_pct))
        
        signal = TradingSignal(
            symbol=symbol,
            direction=direction,
            confidence=confidence,
            entry_price=current_price,
            stop_loss=stop_loss,
            take_profit=take_profit,
            risk_score=0.2,
            strategy_used="Hull Moving Average"
        )
        
        # Log signal with Hull MA details
        logger.info(f"🔄 {symbol} {direction.upper()}: ${current_price:.2f} "
                   f"| WMA1: ${wma1:.2f} | Hull: {n1:.6f}/{n2:.6f} "
                   f"| Confidence: {confidence:.2f}")
        
        return signal
    
    async def momentum_strategy(self, symbol: str, prices: List[float], current_price: float, previous_price: float) -> Optional[TradingSignal]:
        """Simple Momentum Strategy"""
        if len(prices) < 20:
            return None
        
        # Calculate momentum indicators
        math_models = AdvancedMathematicalModels()
        momentum_data = math_models.momentum_oscillator(prices)
        
        rsi = momentum_data.get('rsi', 50)
        macd_histogram = momentum_data.get('macd_histogram', 0)
        
        # Simple momentum rules
        long_condition = rsi < 30 and macd_histogram > 0  # Oversold with positive momentum
        short_condition = rsi > 70 and macd_histogram < 0  # Overbought with negative momentum
        
        if long_condition:
            direction = "long"
            confidence = 0.7
        elif short_condition:
            direction = "short"
            confidence = 0.7
        else:
            return None
        
        return self.create_signal(symbol, direction, confidence, current_price, "Momentum")
    
    async def mean_reversion_strategy(self, symbol: str, prices: List[float], current_price: float, previous_price: float) -> Optional[TradingSignal]:
        """Mean Reversion Strategy"""
        if len(prices) < 20:
            return None
        
        # Calculate Bollinger Bands
        math_models = AdvancedMathematicalModels()
        bb_data = math_models.bollinger_bands_probability(prices)
        
        z_score = bb_data.get('z_score', 0)
        probability_reversal = bb_data.get('probability_reversal', 0.5)
        
        # Mean reversion rules
        long_condition = z_score < -2 and probability_reversal > 0.7  # Price below lower band, high reversal probability
        short_condition = z_score > 2 and probability_reversal > 0.7  # Price above upper band, high reversal probability
        
        if long_condition:
            direction = "long"
            confidence = 0.6
        elif short_condition:
            direction = "short"
            confidence = 0.6
        else:
            return None
        
        return self.create_signal(symbol, direction, confidence, current_price, "Mean Reversion")
    
    async def breakout_strategy(self, symbol: str, prices: List[float], current_price: float, previous_price: float) -> Optional[TradingSignal]:
        """Breakout Strategy"""
        if len(prices) < 20:
            return None
        
        # Calculate volatility and support/resistance
        recent_prices = prices[-20:]
        price_high = max(recent_prices)
        price_low = min(recent_prices)
        price_range = price_high - price_low
        volatility = np.std(recent_prices) / np.mean(recent_prices)
        
        # Breakout rules
        breakout_threshold = 0.02  # 2% breakout
        long_condition = current_price > price_high * (1 + breakout_threshold) and volatility > 0.01
        short_condition = current_price < price_low * (1 - breakout_threshold) and volatility > 0.01
        
        if long_condition:
            direction = "long"
            confidence = 0.75
        elif short_condition:
            direction = "short"
            confidence = 0.75
        else:
            return None
        
        return self.create_signal(symbol, direction, confidence, current_price, "Breakout")
    
    def create_signal(self, symbol: str, direction: str, confidence: float, current_price: float, strategy_name: str) -> TradingSignal:
        """Create a trading signal with risk management"""
        if direction == "long":
            stop_loss = current_price * (1 - self.stop_loss_pct)
            take_profit = current_price + (self.take_profit_pct / (current_price * self.position_size_pct))
        else:
            stop_loss = current_price * (1 + self.stop_loss_pct)
            take_profit = current_price - (self.take_profit_pct / (current_price * self.position_size_pct))
        
        signal = TradingSignal(
            symbol=symbol,
            direction=direction,
            confidence=confidence,
            entry_price=current_price,
            stop_loss=stop_loss,
            take_profit=take_profit,
            risk_score=0.2,
            strategy_used=strategy_name
        )
        
        logger.info(f"🔄 {symbol} {direction.upper()}: ${current_price:.2f} "
                   f"| Strategy: {strategy_name} | Confidence: {confidence:.2f}")
        
        return signal
    
    def round_to_lot_size(self, symbol: str, size: float) -> float:
        """Round position size to valid lot size for each symbol"""
        lot_sizes = {
            'BTC': 0.0001,  # Smaller BTC lot size for better fills
            'ETH': 0.001,   # Smaller ETH lot size
            'SOL': 0.01,    # Smaller SOL lot size
            'AVAX': 0.1,    # AVAX lot size
            'DOGE': 1.0,    # DOGE lot size
            'MATIC': 1.0,   # MATIC lot size
            'LINK': 0.1,    # LINK lot size
            'ADA': 1.0,     # ADA lot size
            'DOT': 0.1,     # DOT lot size
            'UNI': 0.1      # UNI lot size
        }
        
        lot_size = lot_sizes.get(symbol, 0.01)  # Default to 0.01
        return round(size / lot_size) * lot_size

    async def execute_trade(self, signal: TradingSignal):
        """Execute trade based on signal"""
        try:
            # Check if we already have a position for this symbol
            if signal.symbol in self.current_positions:
                logger.info(f"Already have position in {signal.symbol}, skipping trade")
                return
            
            # Small account protection - limit total positions
            if len(self.current_positions) >= self.max_positions:
                logger.info(f"Max positions ({self.max_positions}) reached, skipping new trade")
                return
            
            # Check trade cooldown
            current_time = time.time()
            if current_time - self.last_trade_time.get(signal.symbol, 0) < self.trade_cooldown:
                remaining_cooldown = self.trade_cooldown - (current_time - self.last_trade_time[signal.symbol])
                logger.info(f"Trade cooldown active for {signal.symbol}, {remaining_cooldown:.1f}s remaining")
                return
            
            # Calculate position size (Hull MA Strategy - 15% of equity)
            account_value = await self.get_account_value()
            position_value = account_value * self.position_size_pct  # 15% of account
            raw_position_size = position_value / signal.entry_price
            
            # Apply lot size rounding for each symbol
            position_size = self.round_to_lot_size(signal.symbol, raw_position_size)
            
            # MAXIMUM AGGRESSION - USE ALL $500!
            # These are NOTIONAL values (position value), not margin  
            min_position_values = {
                'BTC': 5000.0,   # $5000 notional = $250 margin @ 20x  
                'ETH': 5000.0,   # $5000 notional = $250 margin @ 20x
                'SOL': 5000.0,   # $5000 notional = $250 margin @ 20x
            }
            
            min_position_value = min_position_values.get(signal.symbol, 4000.0) 
            max_position_value = account_value * 10.0  # Max notional = 10x account (50% margin @ 20x leverage)
            
            if position_value < min_position_value:
                position_size = self.round_to_lot_size(signal.symbol, min_position_value / signal.entry_price)
            elif position_value > max_position_value:
                position_size = self.round_to_lot_size(signal.symbol, max_position_value / signal.entry_price)
            
            # Final check - ensure position is not zero
            if position_size <= 0:
                logger.warning(f"Position size too small for {signal.symbol}, skipping trade")
                return
            
            # Place order
            is_buy = signal.direction == "long"
            
            # Add detailed logging before trade
            logger.info(f"Attempting to execute trade: {signal.symbol} {signal.direction} "
                       f"Size: {position_size:.6f} Price: {signal.entry_price:.4f}")
            
            if self.paper_trading_mode:
                # PAPER TRADING - No real money at risk
                logger.info(f"📝 PAPER TRADE: {signal.symbol} {signal.direction} "
                           f"Size: {position_size:.6f} @ ${signal.entry_price:.2f}")
                
                # Simulate successful order
                order_result = {
                    'status': 'ok', 
                    'response': {
                        'type': 'order', 
                        'data': {
                            'statuses': [{
                                'filled': {
                                    'totalSz': str(position_size), 
                                    'avgPx': str(signal.entry_price), 
                                    'oid': f"PAPER_{int(time.time())}"
                                }
                            }]
                        }
                    }
                }
            else:
                # REAL TRADING
                logger.info(f"Account address: {self.wallet.address}")
                logger.info(f"API Parameters: symbol={signal.symbol}, is_buy={is_buy}, size={position_size}")
                
                order_result = self.exchange.market_open(
                    signal.symbol,
                    is_buy,
                    position_size,
                    None  # No limit price for market order
                )
                
                # Log the full API response
                logger.info(f"API Response: {order_result}")
            
            if order_result and order_result.get('status') == 'ok':
                # Track position
                position = Position(
                    symbol=signal.symbol,
                    side=signal.direction,
                    size=position_size,
                    entry_price=signal.entry_price,
                    current_price=signal.entry_price,
                    unrealized_pnl=0.0,
                    timestamp=datetime.now()
                )
                
                self.current_positions[signal.symbol] = position
                self.total_trades += 1
                self.last_trade_time[signal.symbol] = time.time()  # Update cooldown timer
                
                logger.info(f"Executed {signal.direction} trade for {signal.symbol}: "
                           f"Size: {position_size:.4f}, Entry: {signal.entry_price:.4f}")
                
                # Set stop loss and take profit orders
                await self.set_risk_management_orders(signal, position_size)
                
            else:
                logger.error(f"Failed to execute trade for {signal.symbol}: {order_result}")
                
        except Exception as e:
            logger.error(f"Error executing trade for {signal.symbol}: {e}")
    
    async def set_risk_management_orders(self, signal: TradingSignal, position_size: float):
        """Log risk management levels (monitoring handles actual SL/TP)"""
        try:
            # Don't place orders - let position monitoring handle SL/TP
            logger.info(f"Risk management levels for {signal.symbol}: "
                       f"SL: {signal.stop_loss:.4f}, TP: {signal.take_profit:.4f}")
            logger.info(f"Position monitoring will handle automatic SL/TP execution")
            
        except Exception as e:
            logger.error(f"Error logging risk management for {signal.symbol}: {e}")
    
    async def get_account_value(self) -> float:
        """Get current account value"""
        try:
            user_state = self.info.user_state(self.wallet.address)
            if user_state and 'marginSummary' in user_state:
                account_value = float(user_state.get('marginSummary', {}).get('accountValue', 100.0))
                logger.info(f"Current account value: ${account_value:.2f}")
                return account_value
            else:
                logger.warning("Could not get account value from API")
                return 100.0
        except Exception as e:
            logger.error(f"Error getting account value: {e}")
            return 100.0  # Default fallback
    
    async def monitor_positions(self):
        """Monitor open positions and update ML models"""
        while self.is_running:
            try:
                for symbol, position in list(self.current_positions.items()):
                    # Update current price
                    if symbol in self.market_data_history and self.market_data_history[symbol]:
                        current_price = self.market_data_history[symbol][-1].price
                        position.current_price = current_price
                        
                        # Calculate PnL
                        if position.side == "long":
                            position.unrealized_pnl = (current_price - position.entry_price) * position.size
                        else:
                            position.unrealized_pnl = (position.entry_price - current_price) * position.size
                        
                        # Check if position should be closed (manual risk management)
                        position_value = position.entry_price * position.size
                        if position_value > 0:  # Avoid division by zero
                            pnl_pct = position.unrealized_pnl / position_value
                        else:
                            pnl_pct = 0
                        
                        if pnl_pct <= -self.stop_loss_pct or pnl_pct >= self.take_profit_pct:
                            logger.info(f"🎯 CLOSING {symbol} {position.side}: PnL: {pnl_pct:.2%} "
                                      f"({'STOP LOSS' if pnl_pct <= -self.stop_loss_pct else 'TAKE PROFIT'})")
                            await self.close_position(symbol, position, "Risk management")
                        
                        # Debug: Log position status every 30 seconds
                        if int(time.time()) % 30 == 0:
                            logger.info(f"📊 {symbol} {position.side}: Entry: ${position.entry_price:.2f}, "
                                      f"Current: ${current_price:.2f}, PnL: {pnl_pct:.2%}")
                
                await asyncio.sleep(1)  # Check every second
                
            except Exception as e:
                logger.error(f"Error monitoring positions: {e}")
                await asyncio.sleep(5)
    
    async def close_position(self, symbol: str, position: Position, reason: str = "Manual"):
        """Close a position and update performance tracking"""
        try:
            logger.info(f"🔄 CLOSING {symbol} {position.side} position: Size: {position.size}, "
                       f"PnL: ${position.unrealized_pnl:.2f} | Reason: {reason}")
            
            # Close position via exchange
            close_result = self.exchange.market_close(
                symbol,
                position.size
            )
            
            logger.info(f"Close API Response: {close_result}")
            
            if close_result and close_result.get('status') == 'ok':
                # Update performance tracking
                self.total_pnl += position.unrealized_pnl
                
                if position.unrealized_pnl > 0:
                    self.profitable_trades += 1
                
                logger.info(f"✅ POSITION CLOSED: {symbol} | Total PnL: ${self.total_pnl:.2f}")
                
                # Remove from current positions
                del self.current_positions[symbol]
                
                logger.info(f"Closed {position.side} position in {symbol}: "
                           f"PnL: {position.unrealized_pnl:.4f} ({reason})")
                
                # Update ML model with actual performance
                if symbol in self.ml_engine.models:
                    predicted_change = 0.0  # Would need to store this from signal generation
                    actual_change = (position.current_price - position.entry_price) / position.entry_price
                    self.ml_engine.update_performance(symbol, predicted_change, actual_change)
                
            else:
                logger.error(f"Failed to close position for {symbol}: {close_result}")
                
        except Exception as e:
            logger.error(f"Error closing position for {symbol}: {e}")
    
    async def print_performance_summary(self):
        """Print optimized performance summary"""
        while self.is_running:
            try:
                # Only print detailed summary every 5 minutes, brief updates more frequently
                current_time = time.time()
                
                if not hasattr(self, 'last_detailed_summary'):
                    self.last_detailed_summary = 0
                
                time_since_detailed = current_time - self.last_detailed_summary
                show_detailed = time_since_detailed > 300  # 5 minutes
                
                win_rate = (self.profitable_trades / self.total_trades * 100) if self.total_trades > 0 else 0
                total_collected = sum(len(history) for history in self.market_data_history.values())
                
                if show_detailed or self.total_trades == 0:
                    logger.info("=== PERFORMANCE SUMMARY ===")
                    logger.info(f"Trades: {self.total_trades} | Win Rate: {win_rate:.1f}% | PnL: ${self.total_pnl:.2f}")
                    logger.info(f"Positions: {len(self.current_positions)} | Market: {self.market_condition.title()}")
                    logger.info(f"Data: {total_collected}/{self.total_data_points_target} {'COMPLETE' if self.data_collection_complete else 'COLLECTING'}")
                    
                    # Show positions only if they exist
                    if self.current_positions:
                        for symbol, position in self.current_positions.items():
                            pnl_pct = (position.unrealized_pnl / (position.entry_price * position.size)) * 100
                            emoji = "🟢" if pnl_pct > 0 else "🔴" if pnl_pct < -1 else "🟡"
                            logger.info(f"  {emoji} {symbol}: {position.side.upper()} @ {position.entry_price:.4f} "
                                       f"({pnl_pct:+.1f}%)")
                    
                    logger.info("=" * 30)
                    self.last_detailed_summary = current_time
                    await asyncio.sleep(60)  # Wait 1 minute after detailed summary
                else:
                    # Brief update
                    if self.total_trades > 0 or len(self.current_positions) > 0:
                        logger.info(f"💹 Trades: {self.total_trades} | Positions: {len(self.current_positions)} | "
                                   f"PnL: ${self.total_pnl:.2f} | {self.market_condition.title()}")
                    await asyncio.sleep(120)  # Brief updates every 2 minutes
                
            except Exception as e:
                await asyncio.sleep(30)
    
    def get_user_input(self, prompt, input_type="string", options=None, default=None):
        """Get user input with validation"""
        while True:
            try:
                if options:
                    print(f"\n{prompt}")
                    for i, option in enumerate(options, 1):
                        print(f"  {i}. {option}")
                    if default:
                        print(f"Default: {default}")
                    user_input = input("Choice: ").strip()
                    
                    if not user_input and default:
                        return default
                    
                    if user_input.isdigit() and 1 <= int(user_input) <= len(options):
                        return options[int(user_input) - 1]
                    else:
                        print("❌ Invalid choice. Please select a valid option.")
                        continue
                else:
                    if default:
                        user_input = input(f"{prompt} (default: {default}): ").strip()
                        if not user_input:
                            return default
                    else:
                        user_input = input(f"{prompt}: ").strip()
                    
                    if input_type == "float":
                        return float(user_input)
                    elif input_type == "int":
                        return int(user_input)
                    elif input_type == "private_key":
                        if user_input.startswith('0x') and len(user_input) == 66:
                            return user_input
                        else:
                            print("❌ Invalid private key format. Must start with 0x and be 66 characters long.")
                            continue
                    else:
                        return user_input
                        
            except (ValueError, KeyboardInterrupt) as e:
                if isinstance(e, KeyboardInterrupt):
                    print("\n⏹️ Configuration cancelled by user")
                    exit(0)
                else:
                    print(f"❌ Invalid input. Please try again.")
    
    def configure_bot(self):
        """Interactive bot configuration"""
        print("\n" + "="*60)
        print("🤖 HYPERLIQUID TRADING BOT CONFIGURATION")
        print("="*60)
        print("⚠️  WARNING: This bot trades with REAL MONEY!")
        print("💡 All settings can be changed before starting")
        print("🔐 Your private key is NOT stored anywhere")
        
        # 1. Private Key
        print("\n🔐 STEP 1: HYPERLIQUID PRIVATE KEY")
        print("Enter your Hyperliquid private key (starts with 0x)")
        print("⚠️  This is kept in memory only and never stored!")
        self.user_config['private_key'] = self.get_user_input(
            "Private Key", 
            input_type="private_key"
        )
        
        # 2. Trading Symbols
        print("\n📈 STEP 2: TRADING SYMBOLS")
        available_symbols = ["BTC", "ETH", "SOL", "AVAX", "LINK", "UNI", "DOGE", "ADA", "DOT", "MATIC"]
        print("Available symbols:", ", ".join(available_symbols))
        
        selected_symbols = []
        while len(selected_symbols) < 3:  # At least 1 symbol, max 3 for focused trading
            symbol_input = input(f"Enter symbol {len(selected_symbols) + 1} (or 'done' to finish): ").strip().upper()
            
            if symbol_input == 'DONE' and len(selected_symbols) > 0:
                break
            elif symbol_input in available_symbols and symbol_input not in selected_symbols:
                selected_symbols.append(symbol_input)
                print(f"✅ Added {symbol_input}")
            elif symbol_input in selected_symbols:
                print(f"⚠️ {symbol_input} already selected")
            elif symbol_input:
                print(f"❌ Invalid symbol: {symbol_input}")
        
        self.user_config['symbols'] = selected_symbols
        
        # 3. Risk Management
        print("\n🛡️ STEP 3: RISK MANAGEMENT")
        self.user_config['stop_loss_pct'] = self.get_user_input(
            "Stop Loss Percentage (e.g., 2 for 2%)", 
            input_type="float", 
            default=2.0
        ) / 100
        
        self.user_config['take_profit_target'] = self.get_user_input(
            "Take Profit Target in USD (e.g., 20 for $20)", 
            input_type="float", 
            default=20.0
        )
        
        # 4. Trading Strategy
        print("\n📊 STEP 4: TRADING STRATEGY")
        strategies = [
            "Hull Moving Average (Recommended)",
            "Simple Momentum",
            "Mean Reversion",
            "Breakout Strategy"
        ]
        strategy_choice = self.get_user_input(
            "Select Trading Strategy",
            options=strategies,
            default="Hull Moving Average (Recommended)"
        )
        
        strategy_map = {
            "Hull Moving Average (Recommended)": "hull_ma",
            "Simple Momentum": "momentum",
            "Mean Reversion": "mean_reversion", 
            "Breakout Strategy": "breakout"
        }
        self.user_config['trading_strategy'] = strategy_map[strategy_choice]
        
        # 5. Position Sizing
        print("\n💰 STEP 5: POSITION SIZING")
        self.user_config['position_size_pct'] = self.get_user_input(
            "Position Size as % of account (e.g., 100 for 100%)", 
            input_type="float", 
            default=100.0
        ) / 100
        
        self.user_config['max_positions'] = self.get_user_input(
            "Max Simultaneous Positions", 
            input_type="int", 
            default=2
        )
        
        # Apply configuration
        self.apply_user_config()
        
        # Show final configuration
        self.show_configuration_summary()
    
    def apply_user_config(self):
        """Apply user configuration to bot settings"""
        # Set up Hyperliquid connection
        self.private_key = self.user_config['private_key']
        self.wallet = Account.from_key(self.private_key)
        self.info = Info(constants.MAINNET_API_URL, skip_ws=True)
        self.exchange = Exchange(self.wallet, constants.MAINNET_API_URL, account_address=self.wallet.address)
        
        # Update bot parameters
        self.symbols = self.user_config['symbols']
        self.stop_loss_pct = self.user_config['stop_loss_pct']
        self.take_profit_pct = self.user_config['take_profit_target']
        self.position_size_pct = self.user_config['position_size_pct']
        self.max_positions = self.user_config['max_positions']
        
        # Update data structures for selected symbols
        self.market_data_history = {symbol: deque(maxlen=200) for symbol in self.symbols}
        self.data_buffer = {symbol: [] for symbol in self.symbols}
        self.last_batch_process = {symbol: time.time() for symbol in self.symbols}
        self.recent_signals = {symbol: [] for symbol in self.symbols}
        self.last_trade_time = {symbol: 0 for symbol in self.symbols}
        
        # Update data points target (50 per symbol as requested)
        self.data_points_per_symbol = 50
        self.total_data_points_target = len(self.symbols) * self.data_points_per_symbol
        
        self.config_complete = True
    
    def show_configuration_summary(self):
        """Show final configuration summary"""
        print("\n" + "="*60)
        print("✅ BOT CONFIGURATION COMPLETE")
        print("="*60)
        print(f"🔐 Wallet: {self.wallet.address}")
        print(f"📈 Symbols: {', '.join(self.symbols)}")
        print(f"🛡️ Stop Loss: {self.stop_loss_pct*100:.1f}%")
        print(f"🎯 Take Profit: ${self.take_profit_pct:.0f}")
        print(f"📊 Strategy: {self.user_config['trading_strategy'].replace('_', ' ').title()}")
        print(f"💰 Position Size: {self.position_size_pct*100:.0f}% of account")
        print(f"🔄 Max Positions: {self.max_positions}")
        print(f"📊 Data Collection: {self.total_data_points_target} points ({self.data_points_per_symbol} per symbol)")
        print("="*60)
        
        confirm = input("\n🚀 Start trading with these settings? (yes/no): ").strip().lower()
        if confirm != 'yes':
            print("❌ Bot startup cancelled")
            exit(0)
        
        print("\n🚀 STARTING TRADING BOT...")

    async def run(self):
        """Main bot execution loop with user configuration"""
        try:
            # Get user configuration first
            self.configure_bot()
            
            # Verify account connection
            self.verify_account_connection()
            
            self.is_running = True
            logger.info(f"🚀 Bot configured for {', '.join(self.symbols)} trading")
            logger.info(f"📊 Strategy: {self.user_config['trading_strategy'].title()} | SL: {self.stop_loss_pct*100:.1f}% | TP: ${self.take_profit_pct:.0f}")
            logger.info("🔄 Starting data collection and trading...")
            
            # Start concurrent tasks
            tasks = [
                asyncio.create_task(self.connect_websocket(), name="websocket"),
                asyncio.create_task(self.monitor_positions(), name="monitor"),
                asyncio.create_task(self.print_performance_summary(), name="summary")
            ]
            
            await asyncio.gather(*tasks, return_exceptions=True)
            
        except KeyboardInterrupt:
            logger.info("⏹️ Bot stopped by user")
        except Exception as e:
            logger.error(f"❌ Critical bot error: {e}")
        finally:
            self.is_running = False
            
            # Cleanup and save final state
            try:
                if hasattr(self, 'ml_engine'):
                    self.ml_engine.save_models()
                    logger.info("ML models saved successfully")
            except Exception as e:
                logger.warning(f"Could not save models: {e}")
            
            # Final summary
            if self.total_trades > 0:
                win_rate = (self.profitable_trades / self.total_trades * 100)
                logger.info(f"Final Stats: {self.total_trades} trades, {win_rate:.1f}% win rate, ${self.total_pnl:.2f} PnL")
            
            logger.info("Bot shutdown complete")

# Main execution
if __name__ == "__main__":
    bot = HyperliquidAdvancedBot()
    asyncio.run(bot.run()) 