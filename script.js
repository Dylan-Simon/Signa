// script.js

// --- Manejo de Secciones y Juegos ---

let currentGame = null; // Variable para rastrear el juego actual

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
            currentGame = new SnakeGame(gameWrapper.querySelector('canvas'), gameWrapper.querySelector('.restart-btn'));
            break;
        case 'frogger':
            currentGame = new FroggerGame(gameWrapper.querySelector('canvas'), gameWrapper.querySelector('.restart-btn'));
            break;
        case 'pong':
            currentGame = new PongGame(gameWrapper.querySelector('canvas'), gameWrapper.querySelector('.restart-btn'));
            break;
        case 'space-invaders':
            currentGame = new SpaceInvadersGame(gameWrapper.querySelector('canvas'), gameWrapper.querySelector('.restart-btn'));
            break;
        case 'dino-run':
            currentGame = new DinoRunGame(gameWrapper.querySelector('canvas'), gameWrapper.querySelector('.restart-btn'));
            break;
        default:
            console.error('Juego no encontrado:', gameId);
    }
}

// --- Manejo de Navegación ---
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        if (['snake', 'frogger', 'pong', 'space-invaders', 'dino-run'].includes(targetId)) {
            // Si el enlace es un juego del submenú, mostrar directamente el juego
            showGame(targetId);
        } else if (targetId === 'juegos') {
            showSection('juegos');
        } else {
            showSection(targetId);
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


// --- Implementación de los Juegos en JavaScript ---

class Game {
    constructor(canvas, restartBtn) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.restartBtn = restartBtn;
        this.gameLoop = null;
        this.keys = {};
        this.setupEventListeners();
        this.hideRestartButton(); // Ocultar el botón al inicio
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => { this.keys[e.key] = true; });
        window.addEventListener('keyup', (e) => { this.keys[e.key] = false; });
    }

    cleanup() {
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.keys = {};
        this.hideRestartButton(); // Ocultar el botón al limpiar
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

    // Método para reiniciar el juego - debe ser sobrescrito por cada juego
    restart() {
        console.log("Método restart no implementado para este juego.");
    }
}

class SnakeGame extends Game {
    constructor(canvas, restartBtn) {
        super(canvas, restartBtn);
        this.initGame();
        // Usar setTimeout para asegurar que el canvas esté listo antes de iniciar el loop
        setTimeout(() => {
            this.gameLoop = this.loop.bind(this);
            this.gameLoop();
        }, 100);
    }

    initGame() {
        this.snake = [{x: 100, y: 50}, {x: 90, y: 50}, {x: 80, y: 50}];
        this.direction = 'RIGHT';
        this.nextDirection = 'RIGHT';
        this.apple = this.generateApple();
        this.gameOver = false; // Nueva variable para rastrear si el juego terminó
    }

    generateApple() {
        const x = Math.floor(Math.random() * (this.canvas.width / 10)) * 10;
        const y = Math.floor(Math.random() * (this.canvas.height / 10)) * 10;
        return {x, y};
    }

    update() {
        if (this.gameOver) {
            // Si el juego terminó, no actualizar nada
            return;
        }

        this.direction = this.nextDirection;

        const head = {...this.snake[0]};
        switch (this.direction) {
            case 'UP': head.y -= 10; break;
            case 'DOWN': head.y += 10; break;
            case 'LEFT': head.x -= 10; break;
            case 'RIGHT': head.x += 10; break;
        }

        // Check collision with walls or self
        if (head.x < 0 || head.x >= this.canvas.width || head.y < 0 || head.y >= this.canvas.height || this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver = true;
            this.showRestartButton();
            return; // Detener el juego si pierde
        }

        this.snake.unshift(head);

        if (head.x === this.apple.x && head.y === this.apple.y) {
            this.apple = this.generateApple();
        } else {
            this.snake.pop();
        }
    }

    draw() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'green';
        this.snake.forEach(segment => {
            this.ctx.fillRect(segment.x, segment.y, 10, 10);
        });

        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.apple.x, this.apple.y, 10, 10);

        // Si el juego terminó, mostrar un mensaje (opcional)
        if (this.gameOver) {
            this.ctx.fillStyle = 'white';
            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('¡Game Over!', this.canvas.width/2, this.canvas.height/2);
        }
    }

    restart() {
        this.cleanup(); // Limpia el estado anterior
        this.initGame(); // Reinicia variables del juego
        this.hideRestartButton(); // Oculta el botón de reiniciar
        // Usar setTimeout para asegurar que el canvas esté listo
        setTimeout(() => {
            this.gameLoop = this.loop.bind(this); // Reinicia el bucle
            this.gameLoop();
        }, 100);
    }

    loop() {
        // Handle input for direction change
        if (this.keys['ArrowUp'] && this.direction !== 'DOWN') this.nextDirection = 'UP';
        if (this.keys['ArrowDown'] && this.direction !== 'UP') this.nextDirection = 'DOWN';
        if (this.keys['ArrowLeft'] && this.direction !== 'RIGHT') this.nextDirection = 'LEFT';
        if (this.keys['ArrowRight'] && this.direction !== 'LEFT') this.nextDirection = 'RIGHT';

        this.update();
        this.draw(); // Siempre dibujar, incluso si game over
        if (!this.gameOver) {
            this.gameLoop = requestAnimationFrame(this.loop.bind(this));
        }
        // Si game over, el bucle se detiene automáticamente porque no se llama a requestAnimationFrame
    }
}

class FroggerGame extends Game {
    constructor(canvas, restartBtn) {
        super(canvas, restartBtn);
        this.initGame();
        this.gameLoop = this.loop.bind(this);
        this.gameLoop();
    }

    initGame() {
        this.frog = {x: this.canvas.width/2 - 10, y: this.canvas.height - 30, size: 20};
        this.cars = [];
        for (let i = 0; i < 4; i++) {
            this.cars.push({x: Math.random() * (this.canvas.width - 60), y: i * 80, width: 60, height: 20, speed: Math.random() > 0.5 ? 3 : -3});
        }
    }

    update() {
        // Move frog
        if (this.keys['ArrowLeft'] && this.frog.x > 0) this.frog.x -= 5;
        if (this.keys['ArrowRight'] && this.frog.x < this.canvas.width - this.frog.size) this.frog.x += 5;
        if (this.keys['ArrowUp'] && this.frog.y > 0) this.frog.y -= 5;
        if (this.keys['ArrowDown'] && this.frog.y < this.canvas.height - this.frog.size) this.frog.y += 5;

        // Move cars and check boundaries
        this.cars.forEach(car => {
            car.x += car.speed;
            if (car.x < -car.width) car.x = this.canvas.width;
            if (car.x > this.canvas.width) car.x = -car.width;

            // Check collision
            if (this.frog.x < car.x + car.width &&
                this.frog.x + this.frog.size > car.x &&
                this.frog.y < car.y + car.height &&
                this.frog.y + this.frog.size > car.y) {
                // Show restart button on collision
                this.showRestartButton();
                return; // Stop updating if collision occurs
            }
        });
    }

    draw() {
        this.ctx.fillStyle = '#006400'; // Green background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(this.frog.x, this.frog.y, this.frog.size, this.frog.size);

        this.ctx.fillStyle = 'red';
        this.cars.forEach(car => {
            this.ctx.fillRect(car.x, car.y, car.width, car.height);
        });
    }

    restart() {
        this.cleanup();
        this.initGame();
        this.hideRestartButton();
        this.gameLoop = this.loop.bind(this);
        this.gameLoop();
    }

    loop() {
        this.update();
        if (this.cars.some(car => this.frog.x < car.x + car.width && this.frog.x + this.frog.size > car.x && this.frog.y < car.y + car.height && this.frog.y + this.frog.size > car.y)) {
            // If collision occurred, stop drawing and looping
            return;
        }
        this.draw();
        this.gameLoop = requestAnimationFrame(this.loop.bind(this));
    }
}

class PongGame extends Game {
    constructor(canvas, restartBtn) {
        super(canvas, restartBtn);
        this.initGame();
        this.gameLoop = this.loop.bind(this);
        this.gameLoop();
    }

    initGame() {
        this.ball = {x: this.canvas.width/2, y: this.canvas.height/2, radius: 7, dx: 4, dy: 4};
        this.p1 = {x: 10, y: this.canvas.height/2 - 40, width: 10, height: 80};
        this.p2 = {x: this.canvas.width - 20, y: this.canvas.height/2 - 40, width: 10, height: 80};
    }

    update() {
        // Move paddles
        if (this.keys['w'] && this.p1.y > 0) this.p1.y -= 5;
        if (this.keys['s'] && this.p1.y < this.canvas.height - this.p1.height) this.p1.y += 5;
        if (this.keys['ArrowUp'] && this.p2.y > 0) this.p2.y -= 5;
        if (this.keys['ArrowDown'] && this.p2.y < this.canvas.height - this.p2.height) this.p2.y += 5;

        // Move ball
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        // Wall collision (top/bottom)
        if (this.ball.y <= 0 || this.ball.y >= this.canvas.height) {
            this.ball.dy *= -1;
        }

        // Paddle collision
        if (
            this.ball.x - this.ball.radius <= this.p1.x + this.p1.width &&
            this.ball.y >= this.p1.y &&
            this.ball.y <= this.p1.y + this.p1.height
        ) {
            this.ball.dx *= -1;
        }
        if (
            this.ball.x + this.ball.radius >= this.p2.x &&
            this.ball.y >= this.p2.y &&
            this.ball.y <= this.p2.y + this.p2.height
        ) {
            this.ball.dx *= -1;
        }

        // Reset ball if it goes out (Game Over condition for this example)
        if (this.ball.x < 0 || this.ball.x > this.canvas.width) {
            this.showRestartButton();
            return; // Stop updating if ball goes out
        }
    }

    draw() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.p1.x, this.p1.y, this.p1.width, this.p1.height);
        this.ctx.fillRect(this.p2.x, this.p2.y, this.p2.width, this.p2.height);

        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();
        this.ctx.closePath();
    }

    restart() {
        this.cleanup();
        this.initGame();
        this.hideRestartButton();
        this.gameLoop = this.loop.bind(this);
        this.gameLoop();
    }

    loop() {
        this.update();
        if (this.ball.x < 0 || this.ball.x > this.canvas.width) {
            // If ball went out, stop drawing and looping
            return;
        }
        this.draw();
        this.gameLoop = requestAnimationFrame(this.loop.bind(this));
    }
}

class SpaceInvadersGame extends Game {
    constructor(canvas, restartBtn) {
        super(canvas, restartBtn);
        this.initGame();
        this.gameLoop = this.loop.bind(this);
        this.gameLoop();
    }

    initGame() {
        this.ship = {x: this.canvas.width/2 - 20, y: this.canvas.height - 30, width: 40, height: 20};
        this.bullets = [];
        this.aliens = [];
        for (let x = 0; x < 8; x++) {
            this.aliens.push({x: x * 60 + 50, y: 50, width: 40, height: 20});
        }
    }

    update() {
        // Move ship
        if (this.keys['ArrowLeft'] && this.ship.x > 0) this.ship.x -= 5;
        if (this.keys['ArrowRight'] && this.ship.x < this.canvas.width - this.ship.width) this.ship.x += 5;

        // Shoot bullet
        if (this.keys[' ']) { // Spacebar
            if (!this.lastShot || Date.now() - this.lastShot > 200) { // Rate limit shooting
                this.bullets.push({x: this.ship.x + this.ship.width/2 - 2.5, y: this.ship.y, width: 5, height: 10});
                this.lastShot = Date.now();
            }
        }

        // Move bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].y -= 5;
            if (this.bullets[i].y < 0) {
                this.bullets.splice(i, 1);
            }
        }

        // Collision detection
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            for (let j = this.aliens.length - 1; j >= 0; j--) {
                if (
                    this.bullets[i].x < this.aliens[j].x + this.aliens[j].width &&
                    this.bullets[i].x + this.bullets[i].width > this.aliens[j].x &&
                    this.bullets[i].y < this.aliens[j].y + this.aliens[j].height &&
                    this.bullets[i].y + this.bullets[i].height > this.aliens[j].y
                ) {
                    this.aliens.splice(j, 1);
                    this.bullets.splice(i, 1);
                    break; // Break inner loop to avoid modifying array during iteration
                }
            }
        }

        // Game Over condition: if aliens reach the bottom
        if (this.aliens.some(alien => alien.y >= this.canvas.height - 50)) {
            this.showRestartButton();
            return; // Stop updating if aliens reach the bottom
        }
    }

    draw() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(this.ship.x, this.ship.y, this.ship.width, this.ship.height);

        this.ctx.fillStyle = 'yellow';
        this.bullets.forEach(bullet => {
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });

        this.ctx.fillStyle = 'red';
        this.aliens.forEach(alien => {
            this.ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
        });
    }

    restart() {
        this.cleanup();
        this.initGame();
        this.hideRestartButton();
        this.gameLoop = this.loop.bind(this);
        this.gameLoop();
    }

    loop() {
        this.update();
        if (this.aliens.some(alien => alien.y >= this.canvas.height - 50)) {
            // If aliens reached the bottom, stop drawing and looping
            return;
        }
        this.draw();
        this.gameLoop = requestAnimationFrame(this.loop.bind(this));
    }
}

class DinoRunGame extends Game {
    constructor(canvas, restartBtn) {
        super(canvas, restartBtn);
        this.initGame();
        this.gameLoop = this.loop.bind(this);
        this.gameLoop();
    }

    initGame() {
        this.dino = {x: 50, y: this.canvas.height - 60, width: 30, height: 30};
        this.jump = false;
        this.vel = 0;
        this.gravity = 1;
        this.cactus = {x: this.canvas.width, y: this.canvas.height - 60, width: 20, height: 40};
    }

    update() {
        // Handle jump
        if (this.keys[' '] && !this.jump) {
            this.jump = true;
            this.vel = -15;
        }

        // Apply gravity and update dino position
        if (this.jump) {
            this.dino.y += this.vel;
            this.vel += this.gravity;
            if (this.dino.y >= this.canvas.height - 60) { // Ground level
                this.dino.y = this.canvas.height - 60;
                this.jump = false;
                this.vel = 0;
            }
        }

        // Move cactus
        this.cactus.x -= 5;
        if (this.cactus.x < -this.cactus.width) {
            this.cactus.x = this.canvas.width + Math.random() * 100; // Randomize respawn
        }

        // Collision detection
        if (
            this.dino.x < this.cactus.x + this.cactus.width &&
            this.dino.x + this.dino.width > this.cactus.x &&
            this.dino.y < this.cactus.y + this.cactus.height &&
            this.dino.y + this.dino.height > this.cactus.y
        ) {
             this.showRestartButton();
             return; // Stop updating if collision occurs
        }
    }

    draw() {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(this.dino.x, this.dino.y, this.dino.width, this.dino.height);

        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(this.cactus.x, this.cactus.y, this.cactus.width, this.cactus.height);
    }

    restart() {
        this.cleanup();
        this.initGame();
        this.hideRestartButton();
        this.gameLoop = this.loop.bind(this);
        this.gameLoop();
    }

    loop() {
        this.update();
        if (
            this.dino.x < this.cactus.x + this.cactus.width &&
            this.dino.x + this.dino.width > this.cactus.x &&
            this.dino.y < this.cactus.y + this.cactus.height &&
            this.dino.y + this.dino.height > this.cactus.y
        ) {
            // If collision occurred, stop drawing and looping
            return;
        }
        this.draw();
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
        }
    });
});