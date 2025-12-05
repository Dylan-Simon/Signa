// script.js

// --- Manejo de Secciones y Juegos ---

let currentGame = null; // Variable para rastrear el juego actual
let gameSpeedSetting = 'normal'; // Variable global para velocidad de juego
let soundEnabled = true; // Variable global para sonido

function showSection(sectionId) {
    // Ocultar todas las secciones de contenido
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Ocultar el contenedor de juegos
    document.getElementById('game-container').style.display = 'none';

    // Ocultar todos los wrappers de juegos
    const gameWrappers = document.querySelectorAll('.game-wrapper');
    gameWrappers.forEach(wrapper => {
        wrapper.style.display = 'none';
    });

    // Mostrar la sección solicitada
    if (sectionId === 'inicio') {
        document.querySelector('.hero-section').style.display = 'flex'; // La sección hero es diferente
    } else {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
    }

    // Si se hace clic en "Juegos", mostrar la sección general de juegos
    if (sectionId === 'juegos') {
        document.getElementById('juegos').style.display = 'block';
    }
}

// Función para mostrar el juego seleccionado
function showGame(gameId) {
    // Ocultar todas las secciones de contenido
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Ocultar la sección hero si está visible
    document.querySelector('.hero-section').style.display = 'none';

    // Mostrar el contenedor de juegos
    document.getElementById('game-container').style.display = 'flex';

    // Ocultar todos los wrappers de juegos
    const gameWrappers = document.querySelectorAll('.game-wrapper');
    gameWrappers.forEach(wrapper => {
        wrapper.style.display = 'none';
    });

    // Mostrar el wrapper del juego seleccionado
    const gameWrapper = document.querySelector(`#game-container .game-wrapper:nth-child(${['snake', 'frogger', 'pong', 'space-invaders', 'dino-run'].indexOf(gameId) + 1})`);
    if (gameWrapper) {
        gameWrapper.style.display = 'block';
    }

    // Detener el juego anterior si hay uno corriendo
    if (currentGame && currentGame.cleanup) {
        currentGame.cleanup();
    }

    // Iniciar el nuevo juego
    switch (gameId) {
        case 'snake':
            currentGame = new SnakeGame(
                gameWrapper.querySelector('canvas'),
                gameWrapper.querySelector('.restart-btn'),
                gameWrapper.querySelector('.game-score'),
                gameWrapper.querySelector('#snake-activity-screen'),
                gameWrapper.querySelector('#snake-feedback') // Añadido feedback
            );
            break;
        case 'frogger':
            currentGame = new FroggerGame(
                gameWrapper.querySelector('canvas'),
                gameWrapper.querySelector('.restart-btn'),
                gameWrapper.querySelector('#frogger-activity-screen'),
                gameWrapper.querySelector('#frogger-feedback') // Añadido feedback
            );
            break;
        case 'pong':
            currentGame = new PongGame(
                gameWrapper.querySelector('canvas'),
                gameWrapper.querySelector('.restart-btn'),
                gameWrapper.querySelector('.game-score'),
                gameWrapper.querySelector('#pong-activity-screen'),
                gameWrapper.querySelector('#pong-feedback') // Añadido feedback
            );
            break;
        case 'space-invaders':
            currentGame = new SpaceInvadersGame(
                gameWrapper.querySelector('canvas'),
                gameWrapper.querySelector('.restart-btn'),
                gameWrapper.querySelector('.game-score'),
                gameWrapper.querySelector('#space-invaders-activity-screen'),
                gameWrapper.querySelector('#space-invaders-feedback') // Añadido feedback
            );
            break;
        case 'dino-run':
            currentGame = new DinoRunGame(
                gameWrapper.querySelector('canvas'),
                gameWrapper.querySelector('.restart-btn'),
                gameWrapper.querySelector('.dino-score'),
                gameWrapper.querySelector('#dino-activity-screen'),
                gameWrapper.querySelector('#dino-feedback') // Añadido feedback
            );
            break;
        default:
            console.error('Juego no encontrado:', gameId);
    }
}

// --- Manejo de Navegación ---
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href')?.substring(1);
        if (targetId && ['snake', 'frogger', 'pong', 'space-invaders', 'dino-run'].includes(targetId)) {
            // Si el enlace es un juego del submenú, mostrar directamente el juego
            showGame(targetId);
        } else if (targetId && [
            'juegos', 'logros', 'biblioteca', 'como-jugar', 'perfil', 'mision-del-dia',
            'inclusion', 'comunicacion', 'autonomia', 'habilidades', 'membresias'
        ].includes(targetId)) {
            showSection(targetId);
        } else if (targetId === 'inicio') {
            showSection('inicio');
        }
    });
});

// Botones de "Jugar" en las secciones individuales de juegos
document.querySelectorAll('.play-btn').forEach(button => {
    button.addEventListener('click', function() {
        const gameId = this.getAttribute('data-game');
        showGame(gameId);
    });
});

// Botones de "Jugar" en la sección general de juegos
document.querySelectorAll('.game-btn').forEach(button => {
    button.addEventListener('click', function() {
        const gameId = this.getAttribute('data-game');
        showGame(gameId);
    });
});

// Botón "Ver Planes" en la sección hero
document.querySelector('.hero-section .btn-primary').addEventListener('click', function() {
    showSection('membresias');
});

// Botón "Jugar Ahora" en la sección hero
document.querySelector('.hero-section .btn-outline').addEventListener('click', function() {
    showSection('juegos');
});

// --- Configuración de Perfil ---
document.querySelectorAll('.avatar-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected-avatar'));
        this.classList.add('selected-avatar');
    });
});

document.getElementById('font-size').addEventListener('change', function() {
    const size = this.value;
    document.body.style.fontSize = size === 'normal' ? '16px' : size === 'large' ? '18px' : '20px';
});

document.getElementById('game-speed').addEventListener('change', function() {
    gameSpeedSetting = this.value;
    // Aplicar la velocidad a los juegos activos si es posible
    if (currentGame && currentGame.updateSpeed) {
        currentGame.updateSpeed();
    }
});

document.getElementById('sound').addEventListener('change', function() {
    soundEnabled = this.checked;
});

// --- Autenticación con localStorage ---

const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const loginModal = document.getElementById('login-modal');
const closeModal = document.querySelector('.close');
const authForm = document.getElementById('auth-form');
const modalTitle = document.getElementById('modal-title');
const submitBtn = document.getElementById('submit-btn');
const switchToRegister = document.getElementById('switch-to-register');
const switchToLogin = document.getElementById('switch-to-login');
const confirmPasswordContainer = document.getElementById('confirm-password-container');
const confirmPasswordInput = document.getElementById('confirm-password');

let isRegistering = false; // Estado para saber si estamos registrando o iniciando sesión

loginBtn.addEventListener('click', function() {
    resetForm();
    loginModal.style.display = 'flex';
});

signupBtn.addEventListener('click', function() {
    resetForm();
    isRegistering = true;
    updateFormForRegistration();
    loginModal.style.display = 'flex';
});

closeModal.addEventListener('click', function() {
    loginModal.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

// Alternar entre Iniciar Sesión y Registrarse
switchToRegister.addEventListener('click', function(e) {
    e.preventDefault();
    isRegistering = true;
    updateFormForRegistration();
});

switchToLogin.addEventListener('click', function(e) {
    e.preventDefault();
    isRegistering = false;
    updateFormForLogin();
});

function resetForm() {
    authForm.reset();
    isRegistering = false;
    updateFormForLogin();
}

function updateFormForLogin() {
    modalTitle.textContent = 'Iniciar Sesión';
    submitBtn.textContent = 'Entrar';
    confirmPasswordContainer.style.display = 'none';
    switchToRegister.parentElement.style.display = 'block';
    switchToLogin.parentElement.style.display = 'none';
}

function updateFormForRegistration() {
    modalTitle.textContent = 'Registrarse';
    submitBtn.textContent = 'Registrarse';
    confirmPasswordContainer.style.display = 'block';
    switchToRegister.parentElement.style.display = 'none';
    switchToLogin.parentElement.style.display = 'block';
}

authForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (isRegistering) {
        const confirmPassword = document.getElementById('confirm-password').value;
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        // Verificar si el usuario ya existe
        const existingUsers = JSON.parse(localStorage.getItem('signaUsers')) || [];
        if (existingUsers.some(user => user.email === email)) {
            alert('Ya existe una cuenta con este email.');
            return;
        }

        // Registrar nuevo usuario
        const newUser = { email, password };
        existingUsers.push(newUser);
        localStorage.setItem('signaUsers', JSON.stringify(existingUsers));
        alert(`Registro exitoso para: ${email}.`);
        updateFormForLogin(); // Volver al modo de inicio de sesión después del registro
    } else {
        // Iniciar sesión
        const storedUsers = JSON.parse(localStorage.getItem('signaUsers')) || [];
        const user = storedUsers.find(user => user.email === email && user.password === password);

        if (user) {
            alert(`Inicio de sesión exitoso para: ${email}.`);
            loginModal.style.display = 'none';
        } else {
            alert('Credenciales incorrectas. Inténtalo de nuevo.');
        }
    }
});

// Mostrar la sección "Inicio" por defecto
document.addEventListener('DOMContentLoaded', function() {
    showSection('inicio');
});


// --- Implementación de los Juegos en JavaScript con efecto pixelado CORREGIDO ---

class PixelatedGame {
    constructor(canvas, restartBtn, feedbackElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.restartBtn = restartBtn;
        this.feedbackElement = feedbackElement;

        // --- Canvas interno para el efecto pixelado ---
        this.internalCanvas = document.createElement('canvas');
        this.internalCtx = this.internalCanvas.getContext('2d');
        // Tamaño interno más pequeño para el efecto de píxeles
        this.internalWidth = 300;
        this.internalHeight = 200;
        this.internalCanvas.width = this.internalWidth;
        this.internalCanvas.height = this.internalHeight;

        // Deshabilitar suavizado para mantener los píxeles nítidos
        this.internalCtx.imageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;

        this.gameLoop = null;
        this.keys = {};
        this.setupEventListeners();
        this.hideRestartButton();
        this.hideFeedback();
    }

    setupEventListeners() {
        // Eventos de teclado
        window.addEventListener('keydown', (e) => { this.keys[e.key] = true; });
        window.addEventListener('keyup', (e) => { this.keys[e.key] = false; });

        // Eventos de mouse/pointer para el canvas
        this.canvas.addEventListener('pointerdown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / this.internalWidth;
            const scaleY = this.canvas.height / this.internalHeight;
            const scaleToFit = Math.min(scaleX, scaleY);

            const offsetX = (this.canvas.width - this.internalWidth * scaleToFit) / 2;
            const offsetY = (this.canvas.height - this.internalHeight * scaleToFit) / 2;

            // Convertir coordenadas del canvas visible a coordenadas del canvas interno
            const internalX = (e.clientX - rect.left - offsetX) / scaleToFit;
            const internalY = (e.clientY - rect.top - offsetY) / scaleToFit;

            // Llamar a un método abstracto para manejar el click
            this.handleInternalClick(internalX, internalY);
        });

        // Para eventos de touch
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Evitar scroll
            if (e.touches.length > 0) {
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.canvas.width / this.internalWidth;
                const scaleY = this.canvas.height / this.internalHeight;
                const scaleToFit = Math.min(scaleX, scaleY);

                const offsetX = (this.canvas.width - this.internalWidth * scaleToFit) / 2;
                const offsetY = (this.canvas.height - this.internalHeight * scaleToFit) / 2;

                const internalX = (e.touches[0].clientX - rect.left - offsetX) / scaleToFit;
                const internalY = (e.touches[0].clientY - rect.top - offsetY) / scaleToFit;

                this.handleInternalClick(internalX, internalY);
            }
        });
    }

    handleInternalClick(x, y) {
        // Este método debe ser sobrescrito por cada juego para manejar clicks en el canvas interno
        console.log("Click en canvas interno en:", x, y);
    }

    cleanup() {
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }
        this.internalCtx.clearRect(0, 0, this.internalWidth, this.internalHeight);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.keys = {};
        this.hideRestartButton();
        this.hideFeedback();
    }

    showRestartButton() {
        if (this.restartBtn) {
            this.restartBtn.style.display = 'block';
        }
    }

    hideRestartButton() {
        if (this.restartBtn) {
            this.restartBtn.style.display = 'none';
        }
    }

    showFeedback(message, color = 'white') {
        if (this.feedbackElement) {
            this.feedbackElement.textContent = message;
            this.feedbackElement.style.display = 'block';
            this.feedbackElement.style.color = color;
            this.feedbackElement.style.animation = 'none';
            setTimeout(() => {
                this.feedbackElement.style.animation = 'feedbackFade 1.5s ease forwards';
            }, 10);
        }
    }

    hideFeedback() {
        if (this.feedbackElement) {
            this.feedbackElement.style.display = 'none';
        }
    }

    render() {
        // Dibujar el canvas interno en el canvas visible, escalado
        const scaleX = this.canvas.width / this.internalWidth;
        const scaleY = this.canvas.height / this.internalHeight;
        const scaleToFit = Math.min(scaleX, scaleY);

        const offsetX = (this.canvas.width - this.internalWidth * scaleToFit) / 2;
        const offsetY = (this.canvas.height - this.internalHeight * scaleToFit) / 2;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(
            this.internalCanvas,
            offsetX, offsetY,
            this.internalWidth * scaleToFit,
            this.internalHeight * scaleToFit
        );
    }

    restart() {
        console.log("Método restart no implementado para este juego.");
    }

    updateSpeed() {
        console.log("Método updateSpeed no implementado para este juego.");
    }
}

class SnakeGame extends PixelatedGame {
    constructor(canvas, restartBtn, scoreElement, activityScreen, feedbackElement) {
        super(canvas, restartBtn, feedbackElement);
        this.scoreElement = scoreElement;
        this.activityScreen = activityScreen;
        this.speed = 150;
        this.initGame();
        this.showActivityScreen();
    }

    showActivityScreen() {
        this.activityScreen.style.display = 'flex';
        const options = this.activityScreen.querySelectorAll('.activity-option');
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                const answer = e.currentTarget.getAttribute('data-answer');
                if (answer === 'fruta') {
                    this.activityScreen.style.display = 'none';
                    this.gameLoop = this.loop.bind(this);
                    this.gameLoop();
                } else {
                    alert("¡Intenta de nuevo! Elige una fruta.");
                }
            });
        });
    }

    initGame() {
        this.snake = [{x: 50, y: 25}, {x: 45, y: 25}, {x: 40, y: 25}];
        this.direction = 'RIGHT';
        this.nextDirection = 'RIGHT';
        this.apple = this.generateApple('red');
        this.apple.type = 'fruta';
        this.badFood = this.generateApple('blue');
        this.badFood.type = 'vestimenta';
        this.score = 0;
        this.gameOver = false;
        this.lastUpdate = 0;
    }

    generateApple(color) {
        const x = Math.floor(Math.random() * (this.internalWidth / 5)) * 5;
        const y = Math.floor(Math.random() * (this.internalHeight / 5)) * 5;
        return {x, y, color};
    }

    update() {
        if (this.gameOver) return;

        this.direction = this.nextDirection;

        const head = {...this.snake[0]};
        switch (this.direction) {
            case 'UP': head.y -= 5; break;
            case 'DOWN': head.y += 5; break;
            case 'LEFT': head.x -= 5; break;
            case 'RIGHT': head.x += 5; break;
        }

        if (head.x < 0 || head.x >= this.internalWidth || head.y < 0 || head.y >= this.internalHeight || this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver = true;
            this.showRestartButton();
            this.showFeedback("¡Game Over!", "red");
            return;
        }

        this.snake.unshift(head);

        if (head.x === this.apple.x && head.y === this.apple.y) {
            this.score += 10;
            // Verificar que el elemento existe antes de actualizarlo
            if (this.scoreElement) {
                this.scoreElement.textContent = `Puntos: ${this.score}`;
            }
            this.showFeedback("¡Correcto!", "green");
            this.apple = this.generateApple('red');
            this.apple.type = 'fruta';
            this.badFood = this.generateApple('blue');
            this.badFood.type = 'vestimenta';
        } else if (head.x === this.badFood.x && head.y === this.badFood.y) {
            this.score -= 5;
            if (this.score < 0) this.score = 0;
            // Verificar que el elemento existe antes de actualizarlo
            if (this.scoreElement) {
                this.scoreElement.textContent = `Puntos: ${this.score}`;
            }
            this.showFeedback("¡Incorrecto!", "red");
            this.badFood = this.generateApple('blue');
            this.badFood.type = 'vestimenta';
        } else {
            this.snake.pop();
        }
    }

    draw() {
        this.internalCtx.fillStyle = 'black';
        this.internalCtx.fillRect(0, 0, this.internalWidth, this.internalHeight);

        this.internalCtx.fillStyle = 'green';
        this.snake.forEach(segment => {
            this.internalCtx.fillRect(segment.x, segment.y, 5, 5);
        });

        this.internalCtx.fillStyle = this.apple.color;
        this.internalCtx.fillRect(this.apple.x, this.apple.y, 5, 5);

        this.internalCtx.fillStyle = this.badFood.color;
        this.internalCtx.fillRect(this.badFood.x, this.badFood.y, 5, 5);

        if (this.gameOver) {
            this.internalCtx.fillStyle = 'white';
            this.internalCtx.font = '15px Arial';
            this.internalCtx.textAlign = 'center';
            this.internalCtx.fillText('¡Game Over!', this.internalWidth/2, this.internalHeight/2);
        }
    }

    restart() {
        this.cleanup();
        this.initGame();
        this.hideRestartButton();
        this.hideFeedback();
        // Verificar que el elemento existe antes de actualizarlo
        if (this.scoreElement) {
            this.scoreElement.textContent = `Puntos: ${this.score}`;
        }
        this.gameLoop = this.loop.bind(this);
        this.gameLoop();
    }

    updateSpeed() {
        if (gameSpeedSetting === 'slow') {
            this.speed = 200;
        } else if (gameSpeedSetting === 'fast') {
            this.speed = 100;
        } else {
            this.speed = 150;
        }
    }

    loop(timestamp) {
        if (timestamp - this.lastUpdate > this.speed) {
            if (this.keys['ArrowUp'] && this.direction !== 'DOWN') this.nextDirection = 'UP';
            if (this.keys['ArrowDown'] && this.direction !== 'UP') this.nextDirection = 'DOWN';
            if (this.keys['ArrowLeft'] && this.direction !== 'RIGHT') this.nextDirection = 'LEFT';
            if (this.keys['ArrowRight'] && this.direction !== 'LEFT') this.nextDirection = 'RIGHT';

            this.update();
            this.draw();
            this.render();
            this.lastUpdate = timestamp;
        }
        if (!this.gameOver) {
            this.gameLoop = requestAnimationFrame(this.loop.bind(this));
        }
    }
}

class FroggerGame extends PixelatedGame {
    constructor(canvas, restartBtn, activityScreen, feedbackElement) {
        super(canvas, restartBtn, feedbackElement);
        this.activityScreen = activityScreen;
        this.initGame();
        this.showActivityScreen();
    }

    showActivityScreen() {
        this.activityScreen.style.display = 'flex';
        const buttons = this.activityScreen.querySelectorAll('.seq-btn');
        const sequence = ['right', 'up', 'right'];
        let userSequence = [];

        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const dir = e.currentTarget.getAttribute('data-dir');
                userSequence.push(dir);

                if (userSequence.length === sequence.length) {
                    let isCorrect = true;
                    for (let i = 0; i < sequence.length; i++) {
                        if (userSequence[i] !== sequence[i]) {
                            isCorrect = false;
                            break;
                        }
                    }
                    if (isCorrect) {
                        this.activityScreen.style.display = 'none';
                        this.gameLoop = this.loop.bind(this);
                        this.gameLoop();
                    } else {
                        alert("¡Intenta de nuevo! Sigue la secuencia.");
                    }
                }
            });
        });
    }

    initGame() {
        this.frog = {x: this.internalWidth/2 - 5, y: this.internalHeight - 15, size: 10};
        this.cars = [];
        for (let i = 0; i < 4; i++) {
            this.cars.push({x: Math.random() * (this.internalWidth - 30), y: i * 40, width: 30, height: 10, speed: Math.random() > 0.5 ? 1.5 : -1.5});
        }
        this.goal = { y: 0, height: 15 };
    }

    update() {
        if (this.keys['ArrowLeft'] && this.frog.x > 0) this.frog.x -= 2.5;
        if (this.keys['ArrowRight'] && this.frog.x < this.internalWidth - this.frog.size) this.frog.x += 2.5;
        if (this.keys['ArrowUp'] && this.frog.y > 0) this.frog.y -= 2.5;
        if (this.keys['ArrowDown'] && this.frog.y < this.internalHeight - this.frog.size) this.frog.y += 2.5;

        this.cars.forEach(car => {
            car.x += car.speed;
            if (car.x < -car.width) car.x = this.internalWidth;
            if (car.x > this.internalWidth) car.x = -car.width;

            if (this.frog.x < car.x + car.width &&
                this.frog.x + this.frog.size > car.x &&
                this.frog.y < car.y + car.height &&
                this.frog.y + this.frog.size > car.y) {
                this.showRestartButton();
                this.showFeedback("¡Oh no!", "red");
                return;
            }
        });

        if (this.frog.y <= this.goal.y + this.goal.height) {
            this.showRestartButton();
            this.showFeedback("¡Victoria!", "green");
            return;
        }
    }

    draw() {
        this.internalCtx.fillStyle = '#006400';
        this.internalCtx.fillRect(0, 0, this.internalWidth, this.internalHeight);

        this.internalCtx.fillStyle = '#00FF00';
        this.internalCtx.fillRect(0, this.goal.y, this.internalWidth, this.goal.height);

        this.internalCtx.fillStyle = 'green';
        this.internalCtx.fillRect(this.frog.x, this.frog.y, this.frog.size, this.frog.size);

        this.internalCtx.fillStyle = 'red';
        this.cars.forEach(car => {
            this.internalCtx.fillRect(car.x, car.y, car.width, car.height);
        });
    }

    restart() {
        this.cleanup();
        this.initGame();
        this.hideRestartButton();
        this.hideFeedback();
        this.gameLoop = this.loop.bind(this);
        this.gameLoop();
    }

    updateSpeed() {
        if (gameSpeedSetting === 'slow') {
            this.cars.forEach(car => car.speed = car.speed > 0 ? 0.75 : -0.75);
        } else if (gameSpeedSetting === 'fast') {
            this.cars.forEach(car => car.speed = car.speed > 0 ? 3 : -3);
        } else {
            this.cars.forEach(car => car.speed = car.speed > 0 ? 1.5 : -1.5);
        }
    }

    loop() {
        this.update();
        this.draw();
        this.render();
        if (this.cars.some(car => this.frog.x < car.x + car.width && this.frog.x + this.frog.size > car.x && this.frog.y < car.y + car.height && this.frog.y + this.frog.size > car.y) ||
            this.frog.y <= this.goal.y + this.goal.height) {
            return;
        }
        this.gameLoop = requestAnimationFrame(this.loop.bind(this));
    }
}

class PongGame extends PixelatedGame {
    constructor(canvas, restartBtn, scoreElement, activityScreen, feedbackElement) {
        super(canvas, restartBtn, feedbackElement);
        this.scoreElement = scoreElement;
        this.activityScreen = activityScreen; // La pantalla de actividad
        this.startButton = document.getElementById('start-pong-btn'); // El nuevo botón
        this.submitButton = document.getElementById('submit-count'); // Botón de enviar en la actividad
        this.answerInput = document.getElementById('count-answer'); // Input de la respuesta

        this.initGame();
        this.setupStartButton(); // Configura el botón inicial
        this.hideActivityScreen(); // Oculta la pantalla de actividad al inicio
        this.hideRestartButton(); // Oculta el botón de reiniciar al inicio
        // No inicia el loop aún
    }

    setupStartButton() {
        this.startButton.style.display = 'block'; // Asegura que esté visible
        this.startButton.onclick = () => {
            this.startButton.style.display = 'none'; // Oculta el botón de inicio
            this.hideActivityScreen(); // Asegura que la pantalla de actividad esté oculta
            this.initGame(); // Reinicia el estado del juego si es necesario
            this.gameLoop = this.loop.bind(this);
            this.gameLoop(); // Inicia el bucle del juego
        };
    }

    initGame() {
        // Ajustar posiciones y tamaños según el canvas interno
        this.ball = {x: this.internalWidth/2, y: this.internalHeight/2, radius: 2, dx: 1, dy: 1}; // Tamaño y velocidad ajustados
        this.p1 = {x: 2.5, y: this.internalHeight/2 - 20, width: 2.5, height: 40};
        this.p2 = {x: this.internalWidth - 5, y: this.internalHeight/2 - 20, width: 2.5, height: 40};
        this.score = 0;
        this.bounceCount = 0; // Contador de rebotes
        this.lastBounceY = this.ball.dy; // Para detectar cambio de dirección
        this.gameOver = false; // Nueva condición de fin de juego (puede ser por puntos, tiempo, etc.)
        this.maxScore = 5; // Definir un puntaje máximo para terminar la partida
    }

    update() {
        if (this.gameOver) return; // No actualiza si el juego terminó

        // Move paddles
        if (this.keys['w'] && this.p1.y > 0) this.p1.y -= 1.5; // Ajustar velocidad
        if (this.keys['s'] && this.p1.y < this.internalHeight - this.p1.height) this.p1.y += 1.5;
        if (this.keys['ArrowUp'] && this.p2.y > 0) this.p2.y -= 1.5;
        if (this.keys['ArrowDown'] && this.p2.y < this.internalHeight - this.p2.height) this.p2.y += 1.5;

        // Move ball
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        // Wall collision (top/bottom)
        if (this.ball.y <= 0 || this.ball.y >= this.internalHeight) {
            this.ball.dy *= -1;
            // Detectar rebote
            if (this.lastBounceY !== this.ball.dy) {
                this.bounceCount++;
                this.lastBounceY = this.ball.dy;
            }
        }

        // Paddle collision
        if (
            this.ball.x - this.ball.radius <= this.p1.x + this.p1.width &&
            this.ball.y >= this.p1.y &&
            this.ball.y <= this.p1.y + this.p1.height
        ) {
            this.ball.dx *= -1;
            this.bounceCount++; // Rebote en paleta 1
            this.showFeedback("¡Buen rebote!", "green");
        }
        if (
            this.ball.x + this.ball.radius >= this.p2.x &&
            this.ball.y >= this.p2.y &&
            this.ball.y <= this.p2.y + this.p2.height
        ) {
            this.ball.dx *= -1;
            this.bounceCount++; // Rebote en paleta 2
            this.showFeedback("¡Buen rebote!", "green");
        }

        // Score points (left/right)
        if (this.ball.x < 0) {
            // Punto para P2
            this.score++;
            if (this.scoreElement) {
                this.scoreElement.textContent = `Puntos: ${this.score}`;
            }
            this.resetBall();
        } else if (this.ball.x > this.internalWidth) {
            // Punto para P1
            this.score++;
            if (this.scoreElement) {
                this.scoreElement.textContent = `Puntos: ${this.score}`;
            }
            this.resetBall();
        }

        // Condición de fin de juego (por puntaje)
        if (this.score >= this.maxScore) {
            this.endGame();
        }
    }

    resetBall() {
        this.ball.x = this.internalWidth/2;
        this.ball.y = this.internalHeight/2;
        // Cambiar dirección aleatoriamente
        this.ball.dx = Math.random() > 0.5 ? 1 : -1;
        this.ball.dy = Math.random() > 0.5 ? 1 : -1;
    }

    endGame() {
        this.gameOver = true;
        this.cancelGameLoop(); // Detiene el bucle
        this.showActivityScreen(); // Muestra la pantalla de actividad
    }

    cancelGameLoop() {
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
            this.gameLoop = null;
        }
    }

    showActivityScreen() {
        this.activityScreen.style.display = 'flex';
        this.answerInput.value = ''; // Limpia el input
        this.submitButton.onclick = () => {
            const userAnswer = parseInt(this.answerInput.value);
            if (userAnswer === this.bounceCount) {
                this.showFeedback("¡Correcto!", "green");
                // Opcional: Dar puntos extra o efecto de recompensa
                if (this.scoreElement) {
                    const currentScore = parseInt(this.scoreElement.textContent.split(': ')[1]);
                    this.scoreElement.textContent = `Puntos: ${currentScore + 10}`;
                }
            } else {
                this.showFeedback("¡Incorrecto!", "red");
                // No penaliza, solo informa
            }
            // Oculta la pantalla y vuelve a mostrar el botón de inicio
            this.hideActivityScreen();
            this.startButton.style.display = 'block';
        };
    }

    hideActivityScreen() {
        this.activityScreen.style.display = 'none';
    }

    draw() {
        this.internalCtx.fillStyle = 'black';
        this.internalCtx.fillRect(0, 0, this.internalWidth, this.internalHeight);

        this.internalCtx.fillStyle = 'white';
        this.internalCtx.fillRect(this.p1.x, this.p1.y, this.p1.width, this.p1.height);
        this.internalCtx.fillRect(this.p2.x, this.p2.y, this.p2.width, this.p2.height);

        this.internalCtx.beginPath();
        this.internalCtx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.internalCtx.fillStyle = 'white';
        this.internalCtx.fill();
        this.internalCtx.closePath();
    }

    restart() {
        this.cancelGameLoop();
        this.initGame();
        this.hideRestartButton();
        this.hideFeedback();
        this.hideActivityScreen(); // Asegura que la pantalla de actividad esté oculta
        if (this.scoreElement) {
            this.scoreElement.textContent = `Puntos: ${this.score}`;
        }
        // Vuelve a mostrar el botón de inicio en lugar de reiniciar directamente
        this.startButton.style.display = 'block';
    }

    updateSpeed() {
        // Ajusta la velocidad de la pelota según la configuración
        if (gameSpeedSetting === 'slow') {
            this.ball.dx = Math.sign(this.ball.dx) * 0.75;
            this.ball.dy = Math.sign(this.ball.dy) * 0.75;
        } else if (gameSpeedSetting === 'fast') {
            this.ball.dx = Math.sign(this.ball.dx) * 2;
            this.ball.dy = Math.sign(this.ball.dy) * 2;
        } else { // normal
            this.ball.dx = Math.sign(this.ball.dx) * 1;
            this.ball.dy = Math.sign(this.ball.dy) * 1;
        }
    }

    loop() {
        this.update();
        this.draw();
        this.render();
        if (!this.gameOver) { // Solo sigue si el juego no ha terminado
            this.gameLoop = requestAnimationFrame(this.loop.bind(this));
        }
    }
}

class SpaceInvadersGame extends PixelatedGame {
    constructor(canvas, restartBtn, scoreElement, activityScreen, feedbackElement) {
        super(canvas, restartBtn, feedbackElement);
        this.scoreElement = scoreElement;
        this.activityScreen = activityScreen;
        this.initGame();
        this.showActivityScreen();
    }

    showActivityScreen() {
        this.activityScreen.style.display = 'flex';
        setTimeout(() => {
            this.activityScreen.style.display = 'none';
            this.gameLoop = this.loop.bind(this);
            this.gameLoop();
        }, 3000);
    }

    initGame() {
        this.ship = {x: this.internalWidth/2 - 10, y: this.internalHeight - 15, width: 20, height: 10};
        this.bullets = [];
        this.aliens = [];
        this.alienBullets = [];
        this.alienDirection = 1;
        this.alienMoveTimer = 0;
        this.alienShootTimer = 0;
        this.alienSpeed = 0.15;
        this.score = 0;
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 3; y++) {
                const colors = ['#800080', '#FFA500', '#0000FF'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                this.aliens.push({x: x * 30 + 25, y: y * 20 + 25, width: 20, height: 10, color: color});
            }
        }
        this.autoShootTimer = 0;
    }

    update() {
        if (this.keys['ArrowLeft'] && this.ship.x > 0) this.ship.x -= 2.5;
        if (this.keys['ArrowRight'] && this.ship.x < this.internalWidth - this.ship.width) this.ship.x += 2.5;

        this.autoShootTimer++;
        if (this.autoShootTimer > 30) {
            this.bullets.push({x: this.ship.x + this.ship.width/2 - 1.25, y: this.ship.y, width: 2.5, height: 5});
            this.autoShootTimer = 0;
        }

        for (let i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].y -= 2.5;
            if (this.bullets[i].y < 0) {
                this.bullets.splice(i, 1);
            }
        }

        for (let i = this.alienBullets.length - 1; i >= 0; i--) {
            this.alienBullets[i].y += 1.5;
            if (this.alienBullets[i].y > this.internalHeight) {
                this.alienBullets.splice(i, 1);
            }
        }

        this.alienMoveTimer++;
        if (this.alienMoveTimer > 60) {
            this.alienMoveTimer = 0;
            let edgeHit = false;
            for (const alien of this.aliens) {
                alien.x += this.alienSpeed * this.alienDirection;
                if (alien.x <= 0 || alien.x + alien.width >= this.internalWidth) {
                    edgeHit = true;
                }
            }
            if (edgeHit) {
                this.alienDirection *= -1;
                for (const alien of this.aliens) {
                    alien.y += 10;
                }
            }
        }

        this.alienShootTimer++;
        if (this.alienShootTimer > 120 && this.aliens.length > 0) {
            this.alienShootTimer = 0;
            const shooter = this.aliens[Math.floor(Math.random() * this.aliens.length)];
            this.alienBullets.push({x: shooter.x + shooter.width/2 - 1.25, y: shooter.y + shooter.height, width: 2.5, height: 5});
        }

        for (let i = this.bullets.length - 1; i >= 0; i--) {
            for (let j = this.aliens.length - 1; j >= 0; j--) {
                if (
                    this.bullets[i].x < this.aliens[j].x + this.aliens[j].width &&
                    this.bullets[i].x + this.bullets[i].width > this.aliens[j].x &&
                    this.bullets[i].y < this.aliens[j].y + this.aliens[j].height &&
                    this.bullets[i].y + this.bullets[i].height > this.aliens[j].y
                ) {
                    if (this.aliens[j].color === '#0000FF') {
                        this.aliens.splice(j, 1);
                        this.score += 10;
                        // Verificar que el elemento existe antes de actualizarlo
                        if (this.scoreElement) {
                            this.scoreElement.textContent = `Puntos: ${this.score}`;
                        }
                        this.showFeedback("¡Correcto!", "green");
                    } else {
                        this.showFeedback("¡Incorrecto!", "red");
                        alert("¡Solo debes disparar a los azules!");
                    }
                    this.bullets.splice(i, 1);
                    break;
                }
            }
        }

        for (let i = this.alienBullets.length - 1; i >= 0; i--) {
            if (
                this.alienBullets[i].x < this.ship.x + this.ship.width &&
                this.alienBullets[i].x + this.alienBullets[i].width > this.ship.x &&
                this.alienBullets[i].y < this.ship.y + this.ship.height &&
                this.alienBullets[i].y + this.alienBullets[i].height > this.ship.y
            ) {
                this.showRestartButton();
                this.showFeedback("¡Oh no!", "red");
                return;
            }
        }

        if (this.aliens.some(alien => alien.y >= this.internalHeight - 25)) {
            this.showRestartButton();
            this.showFeedback("¡Game Over!", "red");
            return;
        }
    }

    draw() {
        this.internalCtx.fillStyle = 'black';
        this.internalCtx.fillRect(0, 0, this.internalWidth, this.internalHeight);

        this.internalCtx.fillStyle = 'green';
        this.internalCtx.fillRect(this.ship.x, this.ship.y, this.ship.width, this.ship.height);

        this.internalCtx.fillStyle = 'yellow';
        this.bullets.forEach(bullet => {
            this.internalCtx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });

        this.aliens.forEach(alien => {
            this.internalCtx.fillStyle = alien.color;
            this.internalCtx.fillRect(alien.x, alien.y, alien.width, alien.height);
        });

        this.internalCtx.fillStyle = 'orange';
        this.alienBullets.forEach(bullet => {
            this.internalCtx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
    }

    restart() {
        this.cleanup();
        this.initGame();
        this.hideRestartButton();
        this.hideFeedback();
        // Verificar que el elemento existe antes de actualizarlo
        if (this.scoreElement) {
            this.scoreElement.textContent = `Puntos: ${this.score}`;
        }
        this.gameLoop = this.loop.bind(this);
        this.gameLoop();
    }

    updateSpeed() {
        if (gameSpeedSetting === 'slow') {
            this.alienSpeed = 0.05;
        } else if (gameSpeedSetting === 'fast') {
            this.alienSpeed = 0.3;
        } else {
            this.alienSpeed = 0.15;
        }
    }

    loop() {
        this.update();
        this.draw();
        this.render();
        if (this.aliens.some(alien => alien.y >= this.internalHeight - 25) ||
            this.alienBullets.some(bullet => bullet.x < this.ship.x + this.ship.width && bullet.x + bullet.width > this.ship.x && bullet.y < this.ship.y + this.ship.height && bullet.y + bullet.height > this.ship.y)) {
            return;
        }
        this.gameLoop = requestAnimationFrame(this.loop.bind(this));
    }
}

class DinoRunGame extends PixelatedGame {
    constructor(canvas, restartBtn, scoreElement, activityScreen, feedbackElement) {
        super(canvas, restartBtn, feedbackElement);
        this.scoreElement = scoreElement;
        this.activityScreen = activityScreen;
        this.initGame();
        this.showActivityScreen();
    }

    showActivityScreen() {
        this.activityScreen.style.display = 'flex';
        setTimeout(() => {
            this.activityScreen.style.display = 'none';
            this.gameLoop = this.loop.bind(this);
            this.gameLoop();
        }, 3000);
    }

    initGame() {
        this.dino = {x: 25, y: this.internalHeight - 30, width: 15, height: 15};
        this.jump = false;
        this.vel = 0;
        this.gravity = 0.5;
        this.obstacles = [{x: this.internalWidth, y: this.internalHeight - 30, width: 10, height: 20, type: 'cactus'}];
        this.score = 0;
        this.gameSpeed = 2.5;
        this.lastObstacleTime = Date.now();
        this.obstacleInterval = 1500;
    }

    update() {
        if (this.keys[' '] && !this.jump) {
            this.jump = true;
            this.vel = -7.5;
        }

        if (this.jump) {
            this.dino.y += this.vel;
            this.vel += this.gravity;
            if (this.dino.y >= this.internalHeight - 30) {
                this.dino.y = this.internalHeight - 30;
                this.jump = false;
                this.vel = 0;
            }
        }

        this.gameSpeed = 2.5 + Math.floor(this.score / 100) * 0.25;

        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].x -= this.gameSpeed;
            if (this.obstacles[i].x < -this.obstacles[i].width) {
                this.obstacles.splice(i, 1);
                this.score += 10;
                // Verificar que el elemento existe antes de actualizarlo
                if (this.scoreElement) {
                    this.scoreElement.textContent = `Puntuación: ${this.score}`;
                }
            }
        }

        if (Date.now() - this.lastObstacleTime > this.obstacleInterval) {
            this.obstacles.push({x: this.internalWidth, y: this.internalHeight - 30, width: 10, height: 20, type: 'cactus'});
            this.lastObstacleTime = Date.now();
        }

        for (const obstacle of this.obstacles) {
            if (
                this.dino.x < obstacle.x + obstacle.width &&
                this.dino.x + this.dino.width > obstacle.x &&
                this.dino.y < obstacle.y + obstacle.height &&
                this.dino.y + this.dino.height > obstacle.y
            ) {
                 this.showRestartButton();
                 this.showFeedback("¡Oh no!", "red");
                 return;
            }
        }
    }

    draw() {
        this.internalCtx.fillStyle = 'white';
        this.internalCtx.fillRect(0, 0, this.internalWidth, this.internalHeight);

        this.internalCtx.fillStyle = 'blue';
        this.internalCtx.fillRect(this.dino.x, this.dino.y, this.dino.width, this.dino.height);

        this.internalCtx.fillStyle = 'green';
        this.obstacles.forEach(obstacle => {
            this.internalCtx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }

    restart() {
        this.cleanup();
        this.initGame();
        this.hideRestartButton();
        this.hideFeedback();
        // Verificar que el elemento existe antes de actualizarlo
        if (this.scoreElement) {
            this.scoreElement.textContent = `Puntuación: ${this.score}`;
        }
        this.gameLoop = this.loop.bind(this);
        this.gameLoop();
    }

    updateSpeed() {
        if (gameSpeedSetting === 'slow') {
            this.gameSpeed = 1.5 + Math.floor(this.score / 100) * 0.15;
        } else if (gameSpeedSetting === 'fast') {
            this.gameSpeed = 3.5 + Math.floor(this.score / 100) * 0.35;
        } else {
            this.gameSpeed = 2.5 + Math.floor(this.score / 100) * 0.25;
        }
    }

    loop() {
        this.update();
        this.draw();
        this.render();
        for (const obstacle of this.obstacles) {
            if (
                this.dino.x < obstacle.x + obstacle.width &&
                this.dino.x + this.dino.width > obstacle.x &&
                this.dino.y < obstacle.y + obstacle.height &&
                this.dino.y + this.dino.height > obstacle.y
            ) {
                return;
            }
        }
        this.gameLoop = requestAnimationFrame(this.loop.bind(this));
    }
}

// Añadir evento de clic al botón de reiniciar para cada juego
document.getElementById('restart-snake').addEventListener('click', function() {
    if (currentGame && currentGame instanceof SnakeGame) {
        currentGame.restart();
    }
});

document.getElementById('restart-frogger').addEventListener('click', function() {
    if (currentGame && currentGame instanceof FroggerGame) {
        currentGame.restart();
    }
});

document.getElementById('restart-pong').addEventListener('click', function() {
    if (currentGame && currentGame instanceof PongGame) {
        currentGame.restart();
    }
});

document.getElementById('restart-space-invaders').addEventListener('click', function() {
    if (currentGame && currentGame instanceof SpaceInvadersGame) {
        currentGame.restart();
    }
});

document.getElementById('restart-dino-run').addEventListener('click', function() {
    if (currentGame && currentGame instanceof DinoRunGame) {
        currentGame.restart();
    }
});

// Asegurar que los enlaces del submenú funcionen correctamente
document.querySelectorAll('.dropdown-menu a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        if (['snake', 'frogger', 'pong', 'space-invaders', 'dino-run'].includes(targetId)) {
            showGame(targetId);
        } else {
            showSection(targetId);
        }
    });
});
