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
    },
    // تابع جدید برای دریافت اطلاعات سقف‌ها
    {
        "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
        "name": "getUserCeilings",
        "outputs": [
            {"internalType": "uint256", "name": "totalCeilings", "type": "uint256"},
            {"internalType": "uint256", "name": "activeCeilings", "type": "uint256"},
            {"internalType": "uint256", "name": "completedCeilings", "type": "uint256"}
        ],
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
    document.querySelectorAll('.wallet-balance').forEach(el => {
        el.textContent = '0 پالیگان';
    });
    
    showMessage('اتصال قطع شد', 'info');
}

// تابع ثبت‌نام
async function register() {
    if (!contract) {
        showMessage('لطفاً ابتدا کیف پول را متصل کنید', 'error');
        return;
    }

    try {
        const uplineAddress = document.getElementById('upline-address').value;
        const placeOnLeft = document.querySelector('input[name="place"]:checked').value === 'left';
        
        if (!uplineAddress) {
            showMessage('لطفاً شناسه آپلاین را وارد کنید', 'error');
            return;
        }

        showMessage('در حال ثبت‌نام...', 'info');
        
        const registrationFee = await contract.registrationFee();
        
        const tx = await contract.register(uplineAddress, placeOnLeft, {
            value: registrationFee
        });
        
        showMessage('در حال تأیید تراکنش...', 'info');
        await tx.wait();
        
        showMessage('ثبت‌نام با موفقیت انجام شد!', 'success');
        await checkRegistrationStatus();
        
    } catch (err) {
        console.error('Registration error:', err);
        showMessage('خطا در ثبت‌نام: ' + err.message, 'error');
    }
}

// تابع بررسی وضعیت ثبت‌نام
async function checkRegistrationStatus() {
    if (!contract || !userAccount) return;

    try {
        const userInfo = await contract.getUserInfo(userAccount);
        const isRegistered = userInfo.id > 0;
        
        if (isRegistered) {
            document.getElementById('unregistered-view').style.display = 'none';
            document.getElementById('registered-view').style.display = 'block';
            
            // نمایش اطلاعات کاربر
            document.getElementById('user-id').textContent = userInfo.id.toString();
            document.getElementById('user-upline').textContent = userInfo.uplineId.toString();
            document.getElementById('left-balance').textContent = userInfo.leftCount.toString();
            document.getElementById('right-balance').textContent = userInfo.rightCount.toString();
            document.getElementById('total-referrals').textContent = (userInfo.leftCount + userInfo.rightCount).toString();
            document.getElementById('balance-count').textContent = userInfo.balanceCount.toString();
            
            // به‌روزرسانی اطلاعات ماینر
            updateMinerStats();
        }
    } catch (err) {
        console.error('Error checking registration:', err);
    }
}

// تابع دریافت اطلاعات کاربر
async function fetchUserInfo() {
    if (!contract || !userAccount) return;

    try {
        await checkRegistrationStatus();
    } catch (err) {
        console.error('Error fetching user info:', err);
    }
}

// تابع به‌روزرسانی اطلاعات ماینر
async function updateMinerStats() {
    if (!contract || !userAccount) return;

    try {
        const userInfo = await contract.getUserInfo(userAccount);
        
        // به‌روزرسانی وضعیت ماینر
        const minerStatusElement = document.getElementById('miner-status');
        const minerGlobalStatusElement = document.getElementById('miner-global-status');
        
        if (userInfo.isMiner) {
            minerStatusElement.textContent = 'فعال';
            minerStatusElement.className = 'miner-status-value active';
            minerGlobalStatusElement.innerHTML = '<div class="status-indicator active"></div><span>ماینر فعال</span>';
        } else {
            minerStatusElement.textContent = 'غیرفعال';
            minerStatusElement.className = 'miner-status-value inactive';
            minerGlobalStatusElement.innerHTML = '<div class="status-indicator inactive"></div><span>ماینر غیرفعال</span>';
        }
        
        // به‌روزرسانی آمار ماینر
        document.getElementById('miner-rewards').textContent = ethers.utils.formatEther(userInfo.totalMinerRewards) + ' PToken';
        document.getElementById('special-balance-miner').textContent = userInfo.specialBalanceCount.toString();
        document.getElementById('miner-user-id').textContent = userInfo.id.toString();
        document.getElementById('miner-upline').textContent = userInfo.uplineId.toString();
        document.getElementById('miner-left-count').textContent = userInfo.leftCount.toString();
        document.getElementById('miner-right-count').textContent = userInfo.rightCount.toString();
        
        // به‌روزرسانی اطلاعات سقف‌ها
        await updateCeilingInfo();
        
    } catch (err) {
        console.error('Error updating miner stats:', err);
    }
}

// تابع جدید: دریافت اطلاعات سقف‌ها از قرارداد
async function updateCeilingInfo() {
    if (!contract || !userAccount) return;

    try {
        // فراخوانی تابع جدید برای دریافت اطلاعات سقف‌ها
        const ceilingInfo = await contract.getUserCeilings(userAccount);
        
        // نمایش اطلاعات سقف‌ها در بخش‌های مختلف
        document.getElementById('special-pool-count').textContent = ceilingInfo.activeCeilings.toString();
        document.getElementById('special-balance-miner').textContent = ceilingInfo.activeCeilings.toString();
        
    } catch (err) {
        console.error('Error fetching ceiling info:', err);
        // در صورت عدم وجود تابع، از اطلاعات قدیمی استفاده می‌کنیم
        const userInfo = await contract.getUserInfo(userAccount);
        document.getElementById('special-pool-count').textContent = userInfo.specialBalanceCount.toString();
    }
}

// تابع به‌روزرسانی موجودی کیف پول
async function updateWalletBalance() {
    if (!provider || !userAccount) return;

    try {
        const balance = await provider.getBalance(userAccount);
        const maticBalance = ethers.utils.formatEther(balance);
        
        document.querySelectorAll('.wallet-balance').forEach(el => {
            el.textContent = parseFloat(maticBalance).toFixed(4) + ' پالیگان';
        });
    } catch (err) {
        console.error('Error updating wallet balance:', err);
    }
}

// تابع جدید: به‌روزرسانی موجودی قرارداد
async function updateContractBalance() {
    if (!contract) return;

    try {
        const contractBalance = await contract.contractBalance();
        const maticBalance = ethers.utils.formatEther(contractBalance);
        
        document.getElementById('contract-polygon-balance').textContent = parseFloat(maticBalance).toFixed(4) + ' پالیگان';
    } catch (err) {
        console.error('Error updating contract balance:', err);
    }
}

// تابع جدید: به‌روزرسانی هزینه ثبت‌نام
async function updateRegistrationFee() {
    if (!contract) return;

    try {
        const fee = await contract.registrationFee();
        const maticFee = ethers.utils.formatEther(fee);
        
        document.querySelector('.price-tag').textContent = parseFloat(maticFee).toFixed(2) + ' پالیگان';
    } catch (err) {
        console.error('Error updating registration fee:', err);
    }
}

// تابع خرید توکن ماینر از قرارداد
async function buyMinerWithContract() {
    if (!contract) {
        showMessage('لطفاً ابتدا کیف پول را متصل کنید', 'error');
        return;
    }

    try {
        const amountInput = document.getElementById('miner-purchase-amount').value;
        if (!amountInput || parseFloat(amountInput) <= 0) {
            showMessage('لطفاً مقدار معتبر وارد کنید', 'error');
            return;
        }

        const amountWei = ethers.utils.parseEther(amountInput);
        
        showMessage('در حال خرید توکن ماینر از قرارداد...', 'info');
        
        const tx = await contract.buyMinerWithContract(amountWei);
        
        showMessage('در حال تأیید تراکنش...', 'info');
        await tx.wait();
        
        showMessage('خرید توکن ماینر با موفقیت انجام شد!', 'success');
        
        // به‌روزرسانی موجودی‌ها
        await updateContractBalance();
        await updateMinerStats();
        
        // پاک کردن فیلد ورودی
        document.getElementById('miner-purchase-amount').value = '';
        
    } catch (err) {
        console.error('Error buying miner with contract:', err);
        showMessage('خطا در خرید: ' + err.message, 'error');
    }
}

// تابع خرید توکن ماینر
async function buyMinerTokens() {
    if (!contract) {
        showMessage('لطفاً ابتدا کیف پول را متصل کنید', 'error');
        return;
    }

    try {
        showMessage('در حال خرید توکن ماینر...', 'info');
        
        const tx = await contract.buyMinerTokens();
        
        showMessage('در حال تأیید تراکنش...', 'info');
        await tx.wait();
        
        showMessage('خرید توکن ماینر با موفقیت انجام شد!', 'success');
        await updateMinerStats();
        
    } catch (err) {
        console.error('Error buying miner tokens:', err);
        showMessage('خطا در خرید: ' + err.message, 'error');
    }
}

// تابع توزیع توکن ماینر
async function distributeMinerTokens() {
    if (!contract) {
        showMessage('لطفاً ابتدا کیف پول را متصل کنید', 'error');
        return;
    }

    try {
        showMessage('در حال توزیع توکن ماینر...', 'info');
        
        const tx = await contract.distributeMinerTokens();
        
        showMessage('در حال تأیید تراکنش...', 'info');
        await tx.wait();
        
        showMessage('توزیع توکن ماینر با موفقیت انجام شد!', 'success');
        await updateMinerStats();
        
    } catch (err) {
        console.error('Error distributing miner tokens:', err);
        showMessage('خطا در توزیع: ' + err.message, 'error');
    }
}

// تابع به‌روزرسانی اطلاعات برداشت
async function updateWithdrawInfo() {
    if (!contract || !userAccount) return;

    try {
        // دریافت موجودی استخرها
        const poolBalance = await contract.poolBalance();
        const specialPoolBalance = await contract.specialPoolBalance();
        
        // دریافت تعداد سقف‌ها
        const specialPoolCount = await contract.getSpecialPoolCount();
        
        // دریافت اطلاعات کاربر برای تعداد تعادل‌ها
        const userInfo = await contract.getUserInfo(userAccount);
        
        // به‌روزرسانی نمایش
        document.getElementById('pool-balance').textContent = ethers.utils.formatEther(poolBalance);
        document.getElementById('special-pool-balance').textContent = ethers.utils.formatEther(specialPoolBalance);
        document.getElementById('pool-balance-count').textContent = userInfo.balanceCount.toString();
        document.getElementById('special-pool-count').textContent = specialPoolCount.toString();
        
        // محاسبه مبالغ قابل برداشت
        const poolAmount = poolBalance.mul(userInfo.balanceCount).div(100);
        const specialAmount = specialPoolBalance.mul(specialPoolCount).div(100);
        
        document.getElementById('pool-amount').textContent = ethers.utils.formatEther(poolAmount);
        document.getElementById('special-amount').textContent = ethers.utils.formatEther(specialAmount);
        
    } catch (err) {
        console.error('Error updating withdraw info:', err);
    }
}

// تابع شروع تایمر شمارش معکوس
function startWithdrawTimer() {
    if (!contract) return;
    
    if (withdrawTimer) {
        clearInterval(withdrawTimer);
    }
    
    updateWithdrawTimer();
    withdrawTimer = setInterval(updateWithdrawTimer, 1000);
}

// تابع به‌روزرسانی تایمر برداشت
async function updateWithdrawTimer() {
    if (!contract) return;

    try {
        const lastWithdrawTime = await contract.lastWithdrawTime();
        const withdrawInterval = await contract.getWithdrawTime();
        
        const nextWithdrawTime = lastWithdrawTime.add(withdrawInterval);
        const now = Math.floor(Date.now() / 1000);
        
        const timeLeft = nextWithdrawTime.sub(now);
        
        if (timeLeft.lte(0)) {
            document.getElementById('countdown-timer').textContent = 'آماده برداشت';
            document.getElementById('pool-withdraw-btn').disabled = false;
            document.getElementById('special-withdraw-btn').disabled = false;
        } else {
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = timeLeft % 60;
            
            document.getElementById('countdown-timer').textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            document.getElementById('pool-withdraw-btn').disabled = true;
            document.getElementById('special-withdraw-btn').disabled = true;
        }
    } catch (err) {
        console.error('Error updating withdraw timer:', err);
    }
}

// تابع برداشت از استخر پاداش
async function withdrawPool() {
    if (!contract) {
        showMessage('لطفاً ابتدا کیف پول را متصل کنید', 'error');
        return;
    }

    try {
        showMessage('در حال برداشت از استخر پاداش...', 'info');
        
        const tx = await contract.withdrawPool();
        
        showMessage('در حال تأیید تراکنش...', 'info');
        await tx.wait();
        
        showMessage('برداشت با موفقیت انجام شد!', 'success');
        await updateWithdrawInfo();
        await updateWalletBalance();
        
    } catch (err) {
        console.error('Error withdrawing pool:', err);
        showMessage('خطا در برداشت: ' + err.message, 'error');
    }
}

// تابع برداشت از استخر پاداش ویژه
async function withdrawSpecials() {
    if (!contract) {
        showMessage('لطفاً ابتدا کیف پول را متصل کنید', 'error');
        return;
    }

    try {
        showMessage('در حال برداشت از استخر پاداش ویژه...', 'info');
        
        const tx = await contract.withdrawSpecials();
        
        showMessage('در حال تأیید تراکنش...', 'info');
        await tx.wait();
        
        showMessage('برداشت ویژه با موفقیت انجام شد!', 'success');
        await updateWithdrawInfo();
        await updateWalletBalance();
        
    } catch (err) {
        console.error('Error withdrawing specials:', err);
        showMessage('خطا در برداشت ویژه: ' + err.message, 'error');
    }
}

// تابع نمایش پیام
function showMessage(message, type = 'info') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = message;
    messageEl.className = `message-toast ${type}`;
    messageEl.style.display = 'block';
    
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}

// رویدادهای تغییر حساب و شبکه
if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            disconnectWallet();
        } else {
            connectWallet();
        }
    });
    
    window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload();
    });
}

// رویدادهای محاسبه قیمت برای خرید و فروش
document.getElementById('buy-amount')?.addEventListener('input', updateBuyCalculation);
document.getElementById('sell-amount')?.addEventListener('input', updateSellCalculation);
document.getElementById('miner-purchase-amount')?.addEventListener('input', updateMinerPurchaseCalculation);

// تابع محاسبه خرید توکن P
async function updateBuyCalculation() {
    if (!tokenPContract) return;
    
    try {
        const amount = document.getElementById('buy-amount').value;
        if (!amount || parseFloat(amount) <= 0) return;
        
        const tokenPrice = await tokenPContract.getPTokenPriceInWei();
        const tokensReceived = ethers.utils.parseEther(amount).div(tokenPrice);
        
        document.getElementById('tokens-received').textContent = 
            ethers.utils.formatEther(tokensReceived) + ' توکن P';
        document.getElementById('current-token-price').textContent = 
            ethers.utils.formatEther(tokenPrice) + ' پالیگان';
    } catch (err) {
        console.error('Error updating buy calculation:', err);
    }
}

// تابع محاسبه فروش توکن P
async function updateSellCalculation() {
    if (!tokenPContract) return;
    
    try {
        const amount = document.getElementById('sell-amount').value;
        if (!amount || parseFloat(amount) <= 0) return;
        
        const tokenPrice = await tokenPContract.getPTokenPriceInWei();
        const maticReceived = ethers.utils.parseEther(amount).mul(tokenPrice);
        
        document.getElementById('matic-received').textContent = 
            ethers.utils.formatEther(maticReceived) + ' پالیگان';
        document.getElementById('current-sell-price').textContent = 
            ethers.utils.formatEther(tokenPrice) + ' پالیگان';
    } catch (err) {
        console.error('Error updating sell calculation:', err);
    }
}

// تابع محاسبه خرید توکن ماینر
async function updateMinerPurchaseCalculation() {
    const amount = document.getElementById('miner-purchase-amount').value;
    if (!amount || parseFloat(amount) <= 0) return;
    
    // فرض: هر 1 پالیگان = 1 توکن ماینر (این را با منطق قرارداد تطبیق دهید)
    document.getElementById('miner-tokens-received').textContent = 
        parseFloat(amount).toFixed(4) + ' توکن ماینر';
}

// تابع به‌روزرسانی اطلاعات توکن P
async function updatePTokenInfo() {
    if (!tokenPContract || !userAccount) return;

    try {
        // دریافت موجودی توکن P
        const balance = await tokenPContract.balanceOf(userAccount);
        const tokenPBalance = ethers.utils.formatEther(balance);
        
        document.getElementById('p-token-balance').textContent = parseFloat(tokenPBalance).toFixed(4);
        
        // دریافت قیمت توکن P
        const tokenPrice = await tokenPContract.getPTokenPriceInWei();
        const tokenPriceMatic = ethers.utils.formatEther(tokenPrice);
        
        document.getElementById('p-token-price').textContent = tokenPriceMatic;
        
        // محاسبه ارزش توکن‌ها
        const tokenValue = parseFloat(tokenPBalance) * parseFloat(tokenPriceMatic);
        document.getElementById('p-token-value').textContent = '≈ ' + tokenValue.toFixed(6) + ' پالیگان';
        
        // به‌روزرسانی قیمت‌ها در بخش خرید و فروش
        document.getElementById('current-token-price').textContent = tokenPriceMatic + ' پالیگان';
        document.getElementById('current-sell-price').textContent = tokenPriceMatic + ' پالیگان';
        
        // محاسبه درصد رشد (فرضی)
        const initialPrice = 0.000010; // قیمت اولیه فرضی
        const currentPrice = parseFloat(tokenPriceMatic);
        const growthPercentage = ((currentPrice - initialPrice) / initialPrice) * 100;
        
        document.getElementById('growth-percentage').textContent = growthPercentage.toFixed(2) + '%';
        document.getElementById('initial-price').textContent = initialPrice.toFixed(6) + ' پالیگان';
        
        // به‌روزرسانی محاسبات خرید و فروش
        updateBuyCalculation();
        updateSellCalculation();
        
    } catch (err) {
        console.error('Error updating PToken info:', err);
    }
}

// تابع خرید توکن P
async function buyPTokens() {
    if (!tokenPContract) {
        showMessage('لطفاً ابتدا کیف پول را متصل کنید', 'error');
        return;
    }

    try {
        const amount = document.getElementById('buy-amount').value;
        if (!amount || parseFloat(amount) <= 0) {
            showMessage('لطفاً مقدار معتبر وارد کنید', 'error');
            return;
        }

        const amountWei = ethers.utils.parseEther(amount);
        
        showMessage('در حال خرید توکن P...', 'info');
        
        const tx = await tokenPContract.buyPToken({
            value: amountWei
        });
        
        showMessage('در حال تأیید تراکنش...', 'info');
        await tx.wait();
        
        showMessage('خرید توکن P با موفقیت انجام شد!', 'success');
        
        // به‌روزرسانی اطلاعات
        await updatePTokenInfo();
        await updateWalletBalance();
        
        // پاک کردن فیلد ورودی
        document.getElementById('buy-amount').value = '';
        
    } catch (err) {
        console.error('Error buying P tokens:', err);
        showMessage('خطا در خرید: ' + err.message, 'error');
    }
}

// تابع فروش توکن P
async function sellPTokens() {
    if (!tokenPContract) {
        showMessage('لطفاً ابتدا کیف پول را متصل کنید', 'error');
        return;
    }

    try {
        const amount = document.getElementById('sell-amount').value;
        if (!amount || parseFloat(amount) <= 0) {
            showMessage('لطفاً مقدار معتبر وارد کنید', 'error');
            return;
        }

        const amountWei = ethers.utils.parseEther(amount);
        
        showMessage('در حال فروش توکن P...', 'info');
        
        const tx = await tokenPContract.sellPToken(amountWei);
        
        showMessage('در حال تأیید تراکنش...', 'info');
        await tx.wait();
        
        showMessage('فروش توکن P با موفقیت انجام شد!', 'success');
        
        // به‌روزرسانی اطلاعات
        await updatePTokenInfo();
        await updateWalletBalance();
        
        // پاک کردن فیلد ورودی
        document.getElementById('sell-amount').value = '';
        
    } catch (err) {
        console.error('Error selling P tokens:', err);
        showMessage('خطا در فروش: ' + err.message, 'error');
    }
}