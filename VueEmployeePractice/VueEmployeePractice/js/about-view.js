// This is a simple static page, but it demonstrates how Vue Router can display a different component for a different URL.
(() => {
const {defineComponent} = Vue; 

window.AboutView = defineComponent({
    template: `
        <section>
            <h1 class="app-page-title">About This Project</h1>

            <p>
                This Employee Management Dashboard is a Vue.js
                learning project.
            </p>

            <h3>Technologies Used</h3>

            <ul>
                <li>Vue.js 3</li>
                <li>Vue Router 4</li>
                <li>HTML and CSS</li>
                <li>JavaScript</li>
            </ul>

            <p class="app-muted">
                Practice Project : EMployee data is stored in application memmory and is not save to a database.
            </p>

        </section>
    `
});
})();
