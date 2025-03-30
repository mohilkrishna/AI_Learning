// API Base URL - Update this to your backend URL
const API_BASE_URL = 'http://localhost:5000/api';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        // Redirect to dashboard if logged in
        if (window.location.pathname.includes('login.html') || 
            window.location.pathname.includes('register.html')) {
            window.location.href = 'dashboard.html';
        }
    } else {
        // Redirect to login if not logged in and trying to access protected pages
        if (window.location.pathname.includes('dashboard.html') || 
            window.location.pathname.includes('courses.html')) {
            window.location.href = 'login.html';
        }
    }
}

// Login Function
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Store token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                
                // Show success message
                const messageEl = document.getElementById('loginMessage');
                messageEl.textContent = 'Login successful! Redirecting...';
                messageEl.className = 'message success';
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            const messageEl = document.getElementById('loginMessage');
            messageEl.textContent = error.message;
            messageEl.className = 'message error';
        }
    });
}

// Register Function
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const learningStyle = document.getElementById('learningStyle').value;
        const learningPace = document.getElementById('learningPace').value;
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    name, 
                    email, 
                    password, 
                    learningStyle, 
                    learningPace 
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Store token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                
                // Show success message
                const messageEl = document.getElementById('registerMessage');
                messageEl.textContent = 'Registration successful! Redirecting...';
                messageEl.className = 'message success';
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                throw new Error(data.message || 'Registration failed');
            }
        } catch (error) {
            const messageEl = document.getElementById('registerMessage');
            messageEl.textContent = error.message;
            messageEl.className = 'message error';
        }
    });
}

// Logout Function
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
}

// Initialize auth check when page loads
document.addEventListener('DOMContentLoaded', checkAuth);