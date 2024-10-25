// جلب كل الخلايا (المربعات) من اللعبة، الرسالة اللي هتظهر على الشاشة، وزر إعادة التشغيل
const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart');

// اللاعب الحالي هو 'X' لأنه هو اللي بيبدأ دايمًا
let currentPlayer = 'X';
// حالة اللعبة شغالة، وده معناه إننا لسه بنلعب
let gameActive = true;
// مصفوفة بتمثل الخانات التسعة في اللعبة، وكل خانة فاضية في البداية
let gameState = ["", "", "", "", "", "", "", "", ""];

// دي الشروط اللي بتحدد الفوز: لازم أي لاعب يملأ واحدة من المجموعات دي عشان يكسب
const winningConditions = [
    [0, 1, 2], // أول صف أفقي
    [3, 4, 5], // تاني صف أفقي
    [6, 7, 8], // تالت صف أفقي
    [0, 3, 6], // أول عمود رأسي
    [1, 4, 7], // تاني عمود رأسي
    [2, 5, 8], // تالت عمود رأسي
    [0, 4, 8], // قطر من أعلى اليسار لأسفل اليمين
    [2, 4, 6]  // قطر من أعلى اليمين لأسفل اليسار
];

// دالة بتشوف الخلية اللي تم الضغط عليها
function handleCellClick(event) {
    // الخلية اللي اللاعب ضغط عليها
    const clickedCell = event.target;
    // بنجيب رقم الخلية (index) عشان نقدر نخزن فيه اللعب بتاع اللاعب
    const clickedCellIndex = clickedCell.getAttribute('data-index');

    // لو الخلية مش فاضية أو اللعبة مش شغالة، بنخرج من الدالة (مش هنسمح بالضغط)
    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    // بنسجل لعب اللاعب الحالي في المصفوفة
    gameState[clickedCellIndex] = currentPlayer;
    // بنظهر رمز اللاعب (X أو O) في الخلية
    clickedCell.textContent = currentPlayer;
    // إضافة كلاس 'clicked' لتطبيق تأثير بصري عند النقر
    clickedCell.classList.add('clicked');

    // بعد كل نقرة، بنشوف لو في لاعب كسب
    checkWinner();
}

// دالة بتتحقق إذا كان في لاعب فاز
function checkWinner() {
    let roundWon = false; // متغير بيحدد إذا كان في جولة فائزة
    let winningCells = []; // مصفوفة لتخزين الخلايا الفائزة

    // بنمر على كل الشروط اللي ممكن أي لاعب يكسب بيها
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i]; // الشروط الحالية للفوز
        const a = gameState[winCondition[0]]; // الحالة الأولى في الشرط
        const b = gameState[winCondition[1]]; // الحالة الثانية في الشرط
        const c = gameState[winCondition[2]]; // الحالة الثالثة في الشرط

        // لو في واحدة من الخانات فاضية، بنكمل للدورة التالية
        if (a === '' || b === '' || c === '') {
            continue;
        }

        // لو التلاتة متساويين (يعني كلهم 'X' أو كلهم 'O')، اللاعب كسب
        if (a === b && b === c) {
            roundWon = true; // يعني في جولة فائزة
            winningCells = winCondition; // تخزين الخلايا الفائزة
            break;
        }
    }

    // لو في فوز، بنعرض رسالة فوز للاعب
    if (roundWon) {
        message.textContent = ` Player ${currentPlayer} won! `;
        gameActive = false; // بنوقف اللعبة عشان خلاص حد كسب
        
        // تغيير خلفية الخلايا الفائزة إلى اللون الأخضر
        winningCells.forEach(index => {
            cells[index].style.backgroundColor = 'rgb(170, 231, 170)'; // تغيير لون الخلفية
        });
        
        return;
    }

    // لو مفيش خانات فاضية في المصفوفة يعني في تعادل
    if (!gameState.includes("")) {
        message.textContent = "Draw!";
        gameActive = false; // بنوقف اللعبة لأن مفيش فوز
        return;
    }

    // لو مفيش فوز ولا تعادل، بنغير دور اللاعب
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    message.textContent = `Player role ${currentPlayer}`; // بنظهر دور اللاعب الجديد
}

// دالة إعادة تشغيل اللعبة (Restart)
function restartGame() {
    currentPlayer = 'X'; // إعادة تعيين اللاعب الأول إلى 'X'
    gameActive = true; // بنشغل اللعبة مرة تانية
    gameState = ["", "", "", "", "", "", "", "", ""]; // بنفضي المصفوفة
    message.textContent = `Player role X`; // إعادة تعيين الرسالة للاعب 'X'
    // بنعيد تعيين كل الخلايا وتفريغها من النصوص
    cells.forEach(cell => {
        cell.textContent = ""; // تفريغ محتوى الخلية
        cell.classList.remove('clicked'); // إزالة تأثير النقر
        cell.style.backgroundColor = ''; // إعادة تعيين لون الخلفية
    });
}

// هنا بنضيف الأحداث، لما اللاعب يضغط على أي خلية بتنفذ الدالة 'handleCellClick'
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
// ولما يضغط على زر إعادة التشغيل بتنفذ الدالة 'restartGame'
restartButton.addEventListener('click', restartGame);
