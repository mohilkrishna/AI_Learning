// DOM Elements
const coursesContainer = document.getElementById('coursesContainer');
const categoryFilter = document.getElementById('categoryFilter');
const difficultyFilter = document.getElementById('difficultyFilter');
const applyFiltersBtn = document.getElementById('applyFilters');
const courseSearch = document.getElementById('courseSearch');

// Load All Courses
async function loadAllCourses(filters = {}) {
    try {
        const token = localStorage.getItem('token');
        let url = `${API_BASE_URL}/courses`;
        
        // Add filters to URL if provided
        const queryParams = new URLSearchParams();
        if (filters.category && filters.category !== 'all') {
            queryParams.append('category', filters.category);
        }
        if (filters.difficulty && filters.difficulty !== 'all') {
            queryParams.append('difficulty', filters.difficulty);
        }
        
        if (queryParams.toString()) {
            url += `?${queryParams.toString()}`;
        }
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const courses = await response.json();
        
        if (response.ok) {
            displayCourses(courses);
        } else {
            throw new Error('Failed to load courses');
        }
    } catch (error) {
        console.error('Error:', error);
        coursesContainer.innerHTML = `<p class="error-message">${error.message}</p>`;
    }
}

// Display Courses
function displayCourses(courses) {
    if (courses.length === 0) {
        coursesContainer.innerHTML = '<p>No courses found matching your criteria.</p>';
        return;
    }
    
    let html = '';
    
    courses.forEach(course => {
        // Count the number of content items by type
        const contentTypes = {
            video: course.content.filter(c => c.type === 'video').length,
            text: course.content.filter(c => c.type === 'text').length,
            quiz: course.content.filter(c => c.type === 'quiz').length,
            interactive: course.content.filter(c => c.type === 'interactive').length
        };
        
        html += `
            <div class="course-card">
                <div class="course-card-image" style="background-color: ${getRandomColor()}">
                    <h3>${course.category}</h3>
                </div>
                <div class="course-card-content">
                    <h3>${course.title}</h3>
                    <p>${course.description.substring(0, 100)}...</p>
                    <div class="course-card-meta">
                        <span><i class="fas fa-book"></i> ${contentTypes.text} Lessons</span>
                        <span><i class="fas fa-video"></i> ${contentTypes.video} Videos</span>
                        <span><i class="fas fa-question-circle"></i> ${contentTypes.quiz} Quizzes</span>
                    </div>
                    <div class="course-card-footer">
                        <span class="difficulty-badge ${course.difficulty}">${course.difficulty}</span>
                        <a href="assessment.html?courseId=${course._id}" class="btn btn-primary">Start Course</a>
                    </div>
                </div>
            </div>
        `;
    });
    
    coursesContainer.innerHTML = html;
}

// Apply Filters
function applyFilters() {
    const filters = {
        category: categoryFilter.value,
        difficulty: difficultyFilter.value
    };
    
    loadAllCourses(filters);
}

// Search Courses
function searchCourses() {
    const searchTerm = courseSearch.value.toLowerCase();
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Event Listeners
if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', applyFilters);
}

if (courseSearch) {
    courseSearch.addEventListener('input', searchCourses);
}

// Initialize courses page when loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('courses.html')) {
        loadAllCourses();
    }
});