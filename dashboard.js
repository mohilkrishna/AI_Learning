// DOM Elements
const userNameEl = document.getElementById('userName');
const welcomeMessageEl = document.getElementById('welcomeMessage');
const progressTextEl = document.querySelector('.progress-text');
const completedCoursesEl = document.getElementById('completedCourses');
const currentStreakEl = document.getElementById('currentStreak');
const recommendedCoursesEl = document.getElementById('recommendedCourses');
const progressRing = document.querySelector('.progress-ring-circle');

// Load User Data
function loadUserData() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user) {
        // Display user name
        userNameEl.textContent = user.name;
        
        // Personalized welcome message based on learning style
        let styleMessage = '';
        switch(user.learningStyle) {
            case 'visual':
                styleMessage = 'We\'ve included more diagrams and videos for you.';
                break;
            case 'auditory':
                styleMessage = 'We\'ve included more audio explanations for you.';
                break;
            case 'reading/writing':
                styleMessage = 'We\'ve included more reading materials for you.';
                break;
            case 'kinesthetic':
                styleMessage = 'We\'ve included more interactive exercises for you.';
                break;
            default:
                styleMessage = 'Here are your personalized recommendations.';
        }
        
        welcomeMessageEl.textContent = styleMessage;
        
        // Set progress (example data - replace with actual API call)
        const progress = user.progress || 0;
        progressTextEl.textContent = `${progress}%`;
        
        // Calculate dashoffset for progress ring (326.56 is circumference)
        const offset = 326.56 - (326.56 * progress / 100);
        progressRing.style.strokeDashoffset = offset;
        
        // Set completed courses
        const completedCourses = user.completedCourses ? user.completedCourses.length : 0;
        completedCoursesEl.textContent = completedCourses;
        
        // Set current streak (example data)
        currentStreakEl.textContent = '3 days';
        
        // Load recommended courses
        loadRecommendedCourses(user._id, user.learningStyle, user.learningPace);
    }
}

// Load Recommended Courses
async function loadRecommendedCourses(userId, learningStyle, learningPace) {
    try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_BASE_URL}/courses/personalized`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const courses = await response.json();
        
        if (response.ok) {
            displayRecommendedCourses(courses);
        } else {
            throw new Error('Failed to load recommended courses');
        }
    } catch (error) {
        console.error('Error:', error);
        recommendedCoursesEl.innerHTML = `<p class="error-message">${error.message}</p>`;
    }
}

// Display Recommended Courses
function displayRecommendedCourses(courses) {
    if (courses.length === 0) {
        recommendedCoursesEl.innerHTML = '<p>No recommended courses found. Complete your profile to get better recommendations.</p>';
        return;
    }
    
    let html = '';
    
    // Limit to 4 courses for the dashboard
    const limitedCourses = courses.slice(0, 4);
    
    limitedCourses.forEach(course => {
        html += `
            <div class="recommended-course">
                <div class="course-image" style="background-color: ${getRandomColor()}">
                    <h4>${course.category}</h4>
                </div>
                <div class="course-details">
                    <h4>${course.title}</h4>
                    <p>${course.description.substring(0, 60)}...</p>
                    <div class="course-meta">
                        <span>${course.difficulty}</span>
                        <span>${getRandomTime()} min</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    recommendedCoursesEl.innerHTML = html;
}

// Helper function for random colors
function getRandomColor() {
    const colors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Helper function for random course duration
function getRandomTime() {
    return Math.floor(Math.random() * 60) + 30; // 30-90 minutes
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', loadUserData);