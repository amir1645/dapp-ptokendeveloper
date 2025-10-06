// تنظیمات DApp
const CONFIG = {
    CONTRACT_ADDRESS: "0x166dd205590240c90ca4e0e545ad69db47d8f22f",
    TOKEN_P_CONTRACT_ADDRESS: "0x82F7dBe1792436d15bdA22bB3340bD3f45D614Fa"
};

// ABI قرارداد اصلی
const CONTRACT_ABI = [
    {
        "inputs": [
            {"internalType": "uint256", "name": "uplineCode", "type": "uint256"},
            {"internalType": "bool", "name": "placeOnLeft", "type": "bool"}
        ],
        "name": "register",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "buyMinerTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "distributeMinerTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawPool",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawSpecials",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
        "name": "getUserInfo",
        "outputs": [
            {"internalType": "uint256", "name": "id", "type": "uint256"},
            {"internalType": "uint256", "name": "uplineId", "type": "uint256"},
            {"internalType": "uint256", "name": "leftCount", "type": "uint256"},
            {"internalType": "uint256", "name": "rightCount", "type": "uint256"},
            {"internalType": "uint256", "name": "balanceCount", "type": "uint256"},
            {"internalType": "uint256", "name": "specialBalanceCount", "type": "uint256"},
            {"internalType": "uint256", "name": "totalMinerRewards", "type": "uint256"},
            {"internalType": "bool", "name": "isMiner", "type": "bool"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "poolBalance",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "contractBalance",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
        "name": "buyMinerWithContract",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getWithdrawTime",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "lastWithdrawTime",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "specialPoolBalance",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getSpecialPoolCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "registrationFee",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
];

// ABI قرارداد توکن P
const TOKEN_P_ABI = [
    {
        "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "buyPToken",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getPTokenPriceInWei",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "pTokenAmount", "type": "uint256"}
        ],
        "name": "sellPToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
        "stateMutability": "view",
        "type": "function"
    }
];

// متغیرهای گلوبال
let provider = null;
let signer = null;
let contract = null;
let tokenPContract = null;
let userAccount = null;
let withdrawTimer = null;

// تابع تغییر تب
function switchTab(tabName) {
    // مخفی کردن همه تب‌ها
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // غیرفعال کردن همه آیتم‌های ناوبری
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // نمایش تب انتخاب شده
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // فعال کردن آیتم ناوبری مربوطه
    event.currentTarget.classList.add('active');
    
    // بارگذاری داده‌های مربوطه
    if (contract && userAccount) {
        switch(tabName) {
            case 'user':
                fetchUserInfo();
                break;
            case 'token-p':
                updatePTokenInfo();
                break;
            case 'miner':
                updateMinerStats();
                updateWalletBalance();
                updateContractBalance();
                updateRegistrationFee();
                break;
            case 'withdraw':
                updateWithdrawInfo();
                startWithdrawTimer();
                break;
        }
    }
}

// تابع اتصال به کیف پول
async function connectWallet() {
    try {
        if (!window.ethereum) {
            showMessage('لطفاً MetaMask را نصب کنید', 'error');
            return;
        }

        showMessage('در حال اتصال...', 'info');
        
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        userAccount = await signer.getAddress();
        
        contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        tokenPContract = new ethers.Contract(CONFIG.TOKEN_P_CONTRACT_ADDRESS, TOKEN_P_ABI, signer);
        
        // نمایش اطلاعات حساب
        const accountDisplay = document.getElementById('account');
        const accountAddress = document.querySelector('.account-address');
        accountAddress.textContent = `${userAccount.substring(0, 6)}...${userAccount.substring(38)}`;
        accountDisplay.style.display = 'block';
        
        document.getElementById('connect-btn').style.display = 'none';
        document.getElementById('disconnect-btn').style.display = 'flex';
        
        // بارگذاری اطلاعات اولیه
        await updateWalletBalance();
        await updatePTokenInfo();
        await checkRegistrationStatus();
        await updateRegistrationFee();
        
        showMessage('اتصال با موفقیت برقرار شد!', 'success');
        
    } catch (err) {
        console.error('Connection error:', err);
        showMessage('خطا در اتصال: ' + err.message, 'error');
    }
}

// تابع قطع اتصال
function disconnectWallet() {
    provider = null;
    signer = null;
    contract = null;
    tokenPContract = null;
    userAccount = null;
    
    if (withdrawTimer) {
        clearInterval(withdrawTimer);
        withdrawTimer = null;
    }
    
    document.getElementById('account').style.display = 'none';
    document.getElementById('connect-btn').style.display = 'flex';
    document.getElementById('disconnect-btn').style.display = 'none';
    
    document.getElementById('unregistered-view').style.display = 'block';
    document.getElementById('registered-view').style.display = 'none';
    
    // ریست کردن مقادیر
    document.getElementById('p-token-price').textContent = '0';
    document.getElementById('p-token-balance').textContent = '0';
    document.getElementById('p-token-value').textContent = '≈ 0 پالیگان';
    
    showMessage('اتصال قطع شد', 'info');
}

// تابع به‌روزرسانی هزینه ثبت‌نام از قرارداد
async function updateRegistrationFee() {
    if (!contract) return;

    try {
        const fee = await contract.registrationFee();
        const feeInMatic = ethers.utils.formatEther(fee);
        
        // به‌روزرسانی نمایش هزینه در UI
        const priceTag = document.querySelector('.price-tag');
        if (priceTag) {
            priceTag.textContent = `${parseFloat(feeInMatic).toFixed(1)} پالیگان`;
        }
        
    } catch (err) {
        console.error('Error fetching registration fee:', err);
        // استفاده از مقدار پیش‌فرض در صورت خطا
        const priceTag = document.querySelector('.price-tag');
        if (priceTag) {
            priceTag.textContent = '350 پالیگان';
        }
    }
}

// تابع بررسی وضعیت ثبت‌نام
async function checkRegistrationStatus() {
    if (!contract || !userAccount) return;

    try {
        const user = await contract.getUserInfo(userAccount);
        
        if (user.id.toString() === '0') {
            document.getElementById('unregistered-view').style.display = 'block';
            document.getElementById('registered-view').style.display = 'none';
        } else {
            document.getElementById('unregistered-view').style.display = 'none';
            document.getElementById('registered-view').style.display = 'block';
            await fetchUserInfo();
        }
    } catch (err) {
        console.error('Error checking registration:', err);
        document.getElementById('unregistered-view').style.display = 'block';
        document.getElementById('registered-view').style.display = 'none';
    }
}

// تابع ثبت‌نام
async function register() {
    if (!contract || !userAccount) {
        showMessage('لطفاً ابتدا به کیف پول متصل شوید', 'error');
        return;
    }

    const uplineCode = document.getElementById('upline-address').value;
    const placeOnLeft = document.querySelector('input[name="place"]:checked').value === 'left';

    if (!uplineCode || isNaN(uplineCode)) {
        showMessage('لطفاً شناسه آپلاین معتبر وارد کنید', 'error');
        return;
    }

    try {
        showMessage('در حال پردازش تراکنش...', 'info');
        
        // دریافت هزینه ثبت‌نام از قرارداد
        const registrationFee = await contract.registrationFee();
        
        const tx = await contract.register(uplineCode, placeOnLeft, {
            value: registrationFee,
            gasLimit: 300000
        });
        
        await tx.wait();
        
        showMessage('ثبت‌نام با موفقیت انجام شد!', 'success');
        await checkRegistrationStatus();
        
    } catch (err) {
        console.error('Registration error:', err);
        showMessage('خطا در ثبت‌نام: ' + (err.reason || err.message), 'error');
    }
}

// تابع دریافت اطلاعات کاربر
async function fetchUserInfo() {
    if (!contract || !userAccount) return;

    try {
        const user = await contract.getUserInfo(userAccount);
        
        document.getElementById('user-id').textContent = user.id.toString();
        document.getElementById('user-upline').textContent = user.uplineId.toString();
        document.getElementById('total-referrals').textContent = (parseInt(user.leftCount) + parseInt(user.rightCount)).toString();
        document.getElementById('balance-count').textContent = user.balanceCount.toString();
        document.getElementById('left-balance').textContent = user.leftCount.toString();
        document.getElementById('right-balance').textContent = user.rightCount.toString();
        
    } catch (err) {
        console.error('Error fetching user info:', err);
    }
}

// تابع بروزرسانی اطلاعات توکن P
async function updatePTokenInfo() {
    if (!tokenPContract || !userAccount) {
        console.log('Token contract or user account not available');
        return;
    }

    try {
        // دریافت قیمت واقعی توکن از قرارداد
        const priceInWei = await tokenPContract.getPTokenPriceInWei();
        const priceInMatic = ethers.utils.formatEther(priceInWei);
        
        // دریافت موجودی توکن کاربر
        const tokenBalance = await tokenPContract.balanceOf(userAccount);
        const decimals = await tokenPContract.decimals();
        const formattedBalance = ethers.utils.formatUnits(tokenBalance, decimals);
        
        // محاسبه ارزش کل با قیمت واقعی
        const tokenValue = parseFloat(formattedBalance) * parseFloat(priceInMatic);
        
        // قیمت اولیه ثابت - 0.00001 پالیگان (برای محاسبه درصد رشد)
        const initialPrice = 0.00001;
        const currentPriceNum = parseFloat(priceInMatic);
        
        // محاسبه درصد رشد نسبت به قیمت اولیه
        const growthPercentage = initialPrice > 0 ? 
            ((currentPriceNum - initialPrice) / initialPrice) * 100 : 0;
        
        // به‌روزرسانی UI
        document.getElementById('p-token-price').textContent = parseFloat(priceInMatic).toFixed(8);
        document.getElementById('p-token-balance').textContent = parseFloat(formattedBalance).toFixed(4);
        document.getElementById('p-token-value').textContent = `≈ ${tokenValue.toFixed(6)} پالیگان`;
        
        // به‌روزرسانی موجودی توکن برای فروش
        document.getElementById('available-tokens-sell').textContent = `${parseFloat(formattedBalance).toFixed(4)} توکن P`;
        
        // به‌روزرسانی درصد رشد
        const growthCard = document.getElementById('growth-card');
        const growthPercentageElement = document.getElementById('growth-percentage');
        const initialPriceElement = document.getElementById('initial-price');
        
        growthPercentageElement.textContent = `${growthPercentage.toFixed(2)}%`;
        initialPriceElement.textContent = `${initialPrice.toFixed(6)} پالیگان`;
        
        // تغییر رنگ بر اساس مثبت یا منفی بودن رشد
        if (growthPercentage > 0) {
            growthCard.classList.remove('negative');
            growthCard.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))';
            growthCard.style.border = '1px solid rgba(16, 185, 129, 0.2)';
        } else if (growthPercentage < 0) {
            growthCard.classList.add('negative');
            growthCard.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))';
            growthCard.style.border = '1px solid rgba(239, 68, 68, 0.2)';
        } else {
            growthCard.classList.remove('negative');
            growthCard.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))';
            growthCard.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        }
        
        // به‌روزرسانی موجودی پالیگان برای خرید
        await updateWalletBalance();
        
    } catch (err) {
        console.error('Error fetching PToken info:', err);
        showMessage('خطا در دریافت اطلاعات توکن P', 'error');
    }
}

// تابع محاسبه تعداد توکن‌های قابل خرید
function calculateBuyTokens() {
    const buyAmount = parseFloat(document.getElementById('buy-amount').value);
    const tokenPrice = parseFloat(document.getElementById('p-token-price').textContent);
    
    if (buyAmount && tokenPrice > 0) {
        const tokensReceived = buyAmount / tokenPrice;
        document.getElementById('tokens-received').textContent = `${tokensReceived.toFixed(4)} توکن P`;
        document.getElementById('current-token-price').textContent = `${tokenPrice.toFixed(8)} پالیگان`;
    } else {
        document.getElementById('tokens-received').textContent = '0 توکن P';
        document.getElementById('current-token-price').textContent = '0 پالیگان';
    }
}

// تابع محاسبه مقدار پالیگان قابل دریافت از فروش
function calculateSellMatic() {
    const sellAmount = parseFloat(document.getElementById('sell-amount').value);
    const tokenPrice = parseFloat(document.getElementById('p-token-price').textContent);
    
    if (sellAmount && tokenPrice > 0) {
        const maticReceived = sellAmount * tokenPrice;
        document.getElementById('matic-received').textContent = `${maticReceived.toFixed(6)} پالیگان`;
        document.getElementById('current-sell-price').textContent = `${tokenPrice.toFixed(8)} پالیگان`;
    } else {
        document.getElementById('matic-received').textContent = '0 پالیگان';
        document.getElementById('current-sell-price').textContent = '0 پالیگان';
    }
}

// تابع خرید توکن P
async function buyPTokens() {
    if (!tokenPContract || !userAccount) {
        showMessage('لطفاً ابتدا به کیف پول متصل شوید', 'error');
        return;
    }

    const buyAmount = document.getElementById('buy-amount').value;
    
    if (!buyAmount || parseFloat(buyAmount) <= 0) {
        showMessage('لطفاً مقدار معتبر وارد کنید', 'error');
        return;
    }

    try {
        showMessage('در حال پردازش خرید...', 'info');
        
        const amountInWei = ethers.utils.parseEther(buyAmount);
        const tx = await tokenPContract.buyPToken({
            value: amountInWei,
            gasLimit: 300000
        });
        
        await tx.wait();
        
        showMessage('خرید با موفقیت انجام شد!', 'success');
        await updatePTokenInfo();
        await updateWalletBalance();
        
        // ریست کردن فرم
        document.getElementById('buy-amount').value = '';
        document.getElementById('tokens-received').textContent = '0 توکن P';
        
    } catch (err) {
        console.error('Buy PToken error:', err);
        showMessage('خطا در خرید: ' + (err.reason || err.message), 'error');
    }
}

// تابع فروش توکن P
async function sellPTokens() {
    if (!tokenPContract || !userAccount) {
        showMessage('لطفاً ابتدا به کیف پول متصل شوید', 'error');
        return;
    }

    const sellAmount = document.getElementById('sell-amount').value;
    
    if (!sellAmount || parseFloat(sellAmount) <= 0) {
        showMessage('لطفاً مقدار معتبر وارد کنید', 'error');
        return;
    }

    try {
        showMessage('در حال پردازش فروش...', 'info');
        
        const decimals = await tokenPContract.decimals();
        const tokenAmount = ethers.utils.parseUnits(sellAmount, decimals);
        
        const tx = await tokenPContract.sellPToken(tokenAmount, {
            gasLimit: 300000
        });
        
        await tx.wait();
        
        showMessage('فروش با موفقیت انجام شد!', 'success');
        await updatePTokenInfo();
        await updateWalletBalance();
        
        // ریست کردن فرم
        document.getElementById('sell-amount').value = '';
        document.getElementById('matic-received').textContent = '0 پالیگان';
        
    } catch (err) {
        console.error('Sell PToken error:', err);
        showMessage('خطا در فروش: ' + (err.reason || err.message), 'error');
    }
}

// تابع بروزرسانی آمار ماینر
async function updateMinerStats() {
    if (!contract || !userAccount) return;

    try {
        const user = await contract.getUserInfo(userAccount);
        
        // به‌روزرسانی وضعیت ماینر
        const minerStatus = document.getElementById('miner-status');
        const globalStatus = document.getElementById('miner-global-status');
        
        if (user.isMiner) {
            minerStatus.textContent = 'فعال';
            minerStatus.style.color = '#10B981';
            globalStatus.querySelector('span').textContent = 'ماینر فعال';
            globalStatus.querySelector('.status-indicator').style.background = '#10B981';
            globalStatus.classList.remove('inactive');
        } else {
            minerStatus.textContent = 'غیرفعال';
            minerStatus.style.color = '#FF6584';
            globalStatus.querySelector('span').textContent = 'ماینر غیرفعال';
            globalStatus.querySelector('.status-indicator').style.background = '#FF6584';
            globalStatus.classList.add('inactive');
        }
        
        // به‌روزرسانی آمار دقیق ماینر
        document.getElementById('miner-rewards').textContent = `${ethers.utils.formatEther(user.totalMinerRewards || '0')} PToken`;
        document.getElementById('special-balance-miner').textContent = user.specialBalanceCount.toString();
        
        // به‌روزرسانی اطلاعات کاربر در بخش ماینر
        document.getElementById('miner-user-id').textContent = user.id.toString();
        document.getElementById('miner-upline').textContent = user.uplineId.toString();
        document.getElementById('miner-left-count').textContent = user.leftCount.toString();
        document.getElementById('miner-right-count').textContent = user.rightCount.toString();
        
        // به‌روزرسانی موجودی‌ها
        await updateWalletBalance();
        
    } catch (err) {
        console.error('Error fetching miner stats:', err);
    }
}

// تابع بروزرسانی موجودی قرارداد
async function updateContractBalance() {
    if (!contract) return;

    try {
        const contractBalance = await contract.contractBalance();
        const contractBalanceMatic = ethers.utils.formatEther(contractBalance);
        
        document.getElementById('contract-polygon-balance').textContent = `${parseFloat(contractBalanceMatic).toFixed(4)} پالیگان`;
        document.getElementById('conversion-balance').textContent = `${parseFloat(contractBalanceMatic).toFixed(4)} پالیگان`;
        
    } catch (err) {
        console.error('Error fetching contract balance:', err);
        // اگر تابع contractBalance وجود نداشت، از poolBalance استفاده کن
        try {
            const poolBalance = await contract.poolBalance();
            const poolBalanceMatic = ethers.utils.formatEther(poolBalance);
            document.getElementById('contract-polygon-balance').textContent = `${parseFloat(poolBalanceMatic).toFixed(4)} پالیگان`;
        } catch (err2) {
            console.error('Error fetching pool balance:', err2);
        }
    }
}

// تابع خرید توکن ماینر با پول قرارداد
async function buyMinerWithContract() {
    if (!contract || !userAccount) {
        showMessage('لطفاً ابتدا به کیف پول متصل شوید', 'error');
        return;
    }

    const purchaseAmount = document.getElementById('miner-purchase-amount').value;
    
    if (!purchaseAmount || parseFloat(purchaseAmount) <= 0) {
        showMessage('لطفاً مقدار معتبر وارد کنید', 'error');
        return;
    }

    try {
        showMessage('در حال خرید توکن ماینر از قرارداد...', 'info');
        
        const amountInWei = ethers.utils.parseEther(purchaseAmount);
        const tx = await contract.buyMinerWithContract(amountInWei, {
            gasLimit: 300000
        });
        
        await tx.wait();
        
        showMessage('خرید توکن ماینر با موفقیت انجام شد!', 'success');
        await updateMinerStats();
        await updateContractBalance();
        
        // ریست کردن فرم
        document.getElementById('miner-purchase-amount').value = '';
        document.getElementById('miner-tokens-received').textContent = '0 توکن ماینر';
        
    } catch (err) {
        console.error('Buy miner with contract error:', err);
        showMessage('خطا در خرید: ' + (err.reason || err.message), 'error');
    }
}

// تابع تبدیل پالیگان به توکن P برای ماینر
async function convertToPToken() {
    if (!tokenPContract || !userAccount) {
        showMessage('لطفاً ابتدا به کیف پول متصل شوید', 'error');
        return;
    }

    const conversionAmount = document.getElementById('conversion-amount').value;
    
    if (!conversionAmount || parseFloat(conversionAmount) <= 0) {
        showMessage('لطفاً مقدار معتبر وارد کنید', 'error');
        return;
    }

    try {
        showMessage('در حال تبدیل پالیگان به توکن P...', 'info');
        
        const amountInWei = ethers.utils.parseEther(conversionAmount);
        const tx = await tokenPContract.buyPToken({
            value: amountInWei,
            gasLimit: 300000
        });
        
        await tx.wait();
        
        showMessage('تبدیل با موفقیت انجام شد!', 'success');
        await updatePTokenInfo();
        await updateWalletBalance();
        await updateContractBalance();
        
        // ریست کردن فرم
        document.getElementById('conversion-amount').value = '';
        document.getElementById('p-tokens-received').textContent = '0 توکن P';
        
    } catch (err) {
        console.error('Conversion error:', err);
        showMessage('خطا در تبدیل: ' + (err.reason || err.message), 'error');
    }
}

// تابع خرید توکن ماینر
async function buyMinerTokens() {
    if (!contract || !userAccount) {
        showMessage('لطفاً ابتدا به کیف پول متصل شوید', 'error');
        return;
    }

    try {
        showMessage('در حال خرید توکن ماینر...', 'info');
        
        const tx = await contract.buyMinerTokens({
            gasLimit: 300000
        });
        
        await tx.wait();
        
        showMessage('خرید توکن ماینر با موفقیت انجام شد!', 'success');
        await updateMinerStats();
        await updateWalletBalance();
        
    } catch (err) {
        console.error('Buy miner tokens error:', err);
        showMessage('خطا در خرید: ' + (err.reason || err.message), 'error');
    }
}

// تابع توزیع توکن ماینر
async function distributeMinerTokens() {
    if (!contract || !userAccount) {
        showMessage('لطفاً ابتدا به کیف پول متصل شوید', 'error');
        return;
    }

    try {
        showMessage('در حال توزیع توکن ماینر...', 'info');
        
        const tx = await contract.distributeMinerTokens({
            gasLimit: 300000
        });
        
        await tx.wait();
        
        showMessage('توزیع توکن ماینر با موفقیت انجام شد!', 'success');
        await updateMinerStats();
        await updateWalletBalance();
        
    } catch (err) {
        console.error('Distribute miner tokens error:', err);
        showMessage('خطا در توزیع: ' + (err.reason || err.message), 'error');
    }
}

// تابع بروزرسانی اطلاعات برداشت
async function updateWithdrawInfo() {
    if (!contract || !userAccount) return;

    try {
        const user = await contract.getUserInfo(userAccount);
        const poolBalance = await contract.poolBalance();
        
        // به‌روزرسانی استخر پاداش
        document.getElementById('pool-balance').textContent = parseFloat(ethers.utils.formatEther(poolBalance)).toFixed(4);
        document.getElementById('pool-balance-count').textContent = user.balanceCount.toString();
        document.getElementById('pool-amount').textContent = parseFloat(ethers.utils.formatEther(poolBalance)).toFixed(4);
        
        // به‌روزرسانی استخر پاداش ویژه
        try {
            const specialPoolBalance = await contract.specialPoolBalance();
            const specialPoolCount = await contract.getSpecialPoolCount();
            
            document.getElementById('special-pool-balance').textContent = parseFloat(ethers.utils.formatEther(specialPoolBalance)).toFixed(4);
            document.getElementById('special-pool-count').textContent = specialPoolCount.toString();
            document.getElementById('special-amount').textContent = parseFloat(ethers.utils.formatEther(specialPoolBalance)).toFixed(4);
        } catch (err) {
            console.error('Error fetching special pool info:', err);
            // اگر توابع ویژه وجود نداشت، از اطلاعات کاربر استفاده کن
            document.getElementById('special-pool-balance').textContent = '0';
            document.getElementById('special-pool-count').textContent = user.specialBalanceCount.toString();
            document.getElementById('special-amount').textContent = '0';
        }
        
    } catch (err) {
        console.error('Error fetching withdraw info:', err);
    }
}

// تابع شروع تایمر برداشت
async function startWithdrawTimer() {
    if (!contract || !userAccount) return;

    try {
        // دریافت زمان آخرین برداشت
        const lastWithdrawTime = await contract.lastWithdrawTime();
        const withdrawInterval = 6 * 60 * 60; // 6 ساعت به ثانیه
        
        // محاسبه زمان باقی‌مانده
        const currentTime = Math.floor(Date.now() / 1000);
        const nextWithdrawTime = parseInt(lastWithdrawTime) + withdrawInterval;
        const timeRemaining = nextWithdrawTime - currentTime;
        
        if (timeRemaining > 0) {
            updateWithdrawTimerDisplay(timeRemaining);
            withdrawTimer = setInterval(() => {
                const currentTime = Math.floor(Date.now() / 1000);
                const newTimeRemaining = nextWithdrawTime - currentTime;
                
                if (newTimeRemaining <= 0) {
                    clearInterval(withdrawTimer);
                    document.getElementById('countdown-timer').textContent = 'آماده برای برداشت';
                    document.getElementById('pool-withdraw-btn').disabled = false;
                    document.getElementById('special-withdraw-btn').disabled = false;
                } else {
                    updateWithdrawTimerDisplay(newTimeRemaining);
                }
            }, 1000);
        } else {
            document.getElementById('countdown-timer').textContent = 'آماده برای برداشت';
            document.getElementById('pool-withdraw-btn').disabled = false;
            document.getElementById('special-withdraw-btn').disabled = false;
        }
        
    } catch (err) {
        console.error('Error starting withdraw timer:', err);
        document.getElementById('countdown-timer').textContent = 'خطا در دریافت زمان';
    }
}

// تابع به‌روزرسانی نمایش تایمر
function updateWithdrawTimerDisplay(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    document.getElementById('countdown-timer').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
    // غیرفعال کردن دکمه‌های برداشت اگر زمان نرسیده
    document.getElementById('pool-withdraw-btn').disabled = seconds > 0;
    document.getElementById('special-withdraw-btn').disabled = seconds > 0;
}

// تابع برداشت از استخر پاداش
async function withdrawPool() {
    if (!contract || !userAccount) {
        showMessage('لطفاً ابتدا به کیف پول متصل شوید', 'error');
        return;
    }

    try {
        showMessage('در حال برداشت از استخر پاداش...', 'info');
        
        const tx = await contract.withdrawPool({
            gasLimit: 300000
        });
        
        await tx.wait();
        
        showMessage('برداشت با موفقیت انجام شد!', 'success');
        await updateWithdrawInfo();
        await updateWalletBalance();
        await startWithdrawTimer();
        
    } catch (err) {
        console.error('Withdraw pool error:', err);
        showMessage('خطا در برداشت: ' + (err.reason || err.message), 'error');
    }
}

// تابع برداشت از استخر پاداش ویژه
async function withdrawSpecials() {
    if (!contract || !userAccount) {
        showMessage('لطفاً ابتدا به کیف پول متصل شوید', 'error');
        return;
    }

    try {
        showMessage('در حال برداشت از استخر پاداش ویژه...', 'info');
        
        const tx = await contract.withdrawSpecials({
            gasLimit: 300000
        });
        
        await tx.wait();
        
        showMessage('برداشت ویژه با موفقیت انجام شد!', 'success');
        await updateWithdrawInfo();
        await updateWalletBalance();
        await startWithdrawTimer();
        
    } catch (err) {
        console.error('Withdraw specials error:', err);
        showMessage('خطا در برداشت ویژه: ' + (err.reason || err.message), 'error');
    }
}

// تابع بروزرسانی موجودی کیف پول
async function updateWalletBalance() {
    if (!provider || !userAccount) return;

    try {
        const balance = await provider.getBalance(userAccount);
        const balanceInMatic = ethers.utils.formatEther(balance);
        
        // به‌روزرسانی موجودی در تمام بخش‌ها
        const balanceElements = document.querySelectorAll('.wallet-balance');
        balanceElements.forEach(element => {
            element.textContent = `${parseFloat(balanceInMatic).toFixed(4)} پالیگان`;
        });
        
    } catch (err) {
        console.error('Error fetching wallet balance:', err);
    }
}

// تابع نمایش پیام
function showMessage(message, type = 'info') {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = `message-toast ${type}`;
    messageElement.classList.add('show');
    
    setTimeout(() => {
        messageElement.classList.remove('show');
    }, 5000);
}

// رویدادهای ورودی برای محاسبه بلادرنگ
document.addEventListener('DOMContentLoaded', function() {
    // محاسبه بلادرنگ برای خرید توکن P
    document.getElementById('buy-amount').addEventListener('input', calculateBuyTokens);
    
    // محاسبه بلادرنگ برای فروش توکن P
    document.getElementById('sell-amount').addEventListener('input', calculateSellMatic);
    
    // محاسبه بلادرنگ برای خرید توکن ماینر
    document.getElementById('miner-purchase-amount').addEventListener('input', function() {
        const amount = parseFloat(this.value);
        if (amount && amount > 0) {
            // محاسبه تعداد توکن‌های دریافتی (فرض: 1 توکن ماینر به ازای هر 17.5 پالیگان)
            const tokensReceived = amount / 17.5;
            document.getElementById('miner-tokens-received').textContent = `${tokensReceived.toFixed(4)} توکن ماینر`;
        } else {
            document.getElementById('miner-tokens-received').textContent = '0 توکن ماینر';
        }
    });
    
    // محاسبه بلادرنگ برای تبدیل پالیگان به توکن P
    document.getElementById('conversion-amount').addEventListener('input', function() {
        const amount = parseFloat(this.value);
        const tokenPrice = parseFloat(document.getElementById('p-token-price').textContent);
        
        if (amount && tokenPrice > 0) {
            const tokensReceived = amount / tokenPrice;
            document.getElementById('p-tokens-received').textContent = `${tokensReceived.toFixed(4)} توکن P`;
        } else {
            document.getElementById('p-tokens-received').textContent = '0 توکن P';
        }
    });
    
    // بررسی تغییر حساب در MetaMask
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', function(accounts) {
            if (accounts.length === 0) {
                disconnectWallet();
            } else {
                connectWallet();
            }
        });
        
        window.ethereum.on('chainChanged', function() {
            window.location.reload();
        });
        
        // بررسی اتصال خودکار اگر کیف پول قبلاً متصل بوده
        if (window.ethereum.selectedAddress) {
            setTimeout(connectWallet, 1000);
        }
    }
});