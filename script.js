let player1HP = 50; 
let p1Combo = 0;
let p2Combo = 0;
let currentQuestion = { text: "", isTrue: false };
let gameActive = true;

const COMBO_THRESHOLD = 3;
const NORMAL_DMG = 8;
const POWER_DMG = 16; // Damage saat burning (2x lipat)

const p1Area = document.getElementById('p1-area');
const p2Area = document.getElementById('p2-area');
const p1ComboBadge = document.getElementById('p1-combo');
const p2ComboBadge = document.getElementById('p2-combo');

function generateQuestion() {
    const type = Math.random();
    let text = "";
    let isTrue = false;

    if (type > 0.5) {
        // Tipe Persamaan
        const a = Math.floor(Math.random() * 15) + 5;
        const b = Math.floor(Math.random() * 15) + 5;
        const sum = a + b;
        const displaySum = Math.random() > 0.5 ? sum : sum + (Math.floor(Math.random() * 4) - 2);
        text = `${a} + ${b} = ${displaySum}`;
        isTrue = (sum === displaySum);
    } else {
        // Tipe Perbandingan
        const a = Math.floor(Math.random() * 10) + 2;
        const b = Math.floor(Math.random() * 8) + 2;
        const res = a * b;
        const comp = res + (Math.floor(Math.random() * 16) - 8);
        text = `${a} × ${b} > ${comp}`;
        isTrue = (res > comp);
    }

    currentQuestion = { text, isTrue };
    document.getElementById('p1-question').innerText = text;
    document.getElementById('p2-question').innerText = text;
}

function handleAnswer(playerNum, choice) {
    if (!gameActive) return;

    if (choice === currentQuestion.isTrue) {
        // JAWABAN BENAR
        let damage = NORMAL_DMG;

        if (playerNum === 1) {
            p1Combo++;
            p2Combo = 0; // Reset combo lawan
            if (p1Combo >= COMBO_THRESHOLD) {
                damage = POWER_DMG;
                p1Area.classList.add('burning');
            }
            moveBar(damage);
        } else {
            p2Combo++;
            p1Combo = 0; // Reset combo lawan
            if (p2Combo >= COMBO_THRESHOLD) {
                damage = POWER_DMG;
                p2Area.classList.add('burning');
            }
            moveBar(-damage);
        }
        updateComboUI();
        generateQuestion();
    } else {
        // JAWABAN SALAH (Reset Combo & Penalti)
        if (playerNum === 1) {
            p1Combo = 0;
            p1Area.classList.remove('burning');
            moveBar(-5); // Mundur karena salah
        } else {
            p2Combo = 0;
            p2Area.classList.remove('burning');
            moveBar(5);
        }
        updateComboUI();
    }
}

function updateComboUI() {
    // Player 1 UI
    if (p1Combo > 0) {
        p1ComboBadge.style.display = "block";
        p1ComboBadge.innerText = `COMBO X${p1Combo}`;
    } else {
        p1ComboBadge.style.display = "none";
        p1Area.classList.remove('burning');
    }

    // Player 2 UI
    if (p2Combo > 0) {
        p2ComboBadge.style.display = "block";
        p2ComboBadge.innerText = `COMBO X${p2Combo}`;
    } else {
        p2ComboBadge.style.display = "none";
        p2Area.classList.remove('burning');
    }
}

function moveBar(amount) {
    player1HP += amount;
    if (player1HP >= 100) endGame("PLAYER 1 WINS!");
    if (player1HP <= 0) endGame("PLAYER 2 WINS!");
    document.getElementById('hp-bar').style.width = player1HP + "%";
}

function endGame(msg) {
    gameActive = false;
    document.getElementById('winner-text').innerText = msg;
    document.getElementById('overlay').classList.remove('hidden');
}

function resetGame() {
    player1HP = 50; p1Combo = 0; p2Combo = 0;
    gameActive = true;
    document.getElementById('hp-bar').style.width = "50%";
    p1Area.classList.remove('burning');
    p2Area.classList.remove('burning');
    updateComboUI();
    document.getElementById('overlay').classList.add('hidden');
    generateQuestion();
}

generateQuestion();