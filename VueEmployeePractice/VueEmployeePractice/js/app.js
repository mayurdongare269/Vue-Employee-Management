// This is the main application file. It creates the shared employee list, 
// defines the routes, handles add/delete operations, and mounts Vue.

// const { Component } = require("react");

const {
    createApp,
    ref,
    onMounted
} = Vue;

// 1. define routes

const routes = [
    {
        path: "/",
        redirect: "/dashboard"
    },

    {
        path: "/dashboard",
        component: window.DashboardView
    },

    {
        path: "/employees",
        component: window.EmployeeView
    },

    {
        path: "/about",
        component: window.AboutView
    },

    {
        // Unknown URLs return the user to the dashboard.
        path: "/:pathMatch(.*)*",
        redirect: "/dashboard"
    }
];


// 2.Create Vue Router
const router = VueRouter.createRouter({
    // Hash history works well with CDN + Live Server.
    // Example URL: http://127.0.0.1:5500/#/employees
    history: VueRouter.createWebHashHistory(),

    routes
});


// 3.Create the main Vue application
const app = createApp({
    setup() {
        // Shared reactive employee data.
        // All pages receive the same employee list.

        const employees = ref([
            {
                id: 1,
                name: "Mayur Dongare",
                email: "mayur@example.com",
                department: "IT",
                position: "Trainee Developer"
            },
            {
                id: 2,
                name: "Vivek Rathod",
                email: "vivek@example.com",
                department: "Engineering",
                position: "Senior Software Developer"
            },
            {
                id: 3,
                name: "Abhishek",
                email: "abhi@example.com",
                department: "HR",
                position: "HR Executive"
            },
            {
                id: 4,
                name: "Amit Deshmukh",
                email: "amit@example.com",
                department: "Finance",
                position: "Financial Analyst"
            },
            {
                id: 5,
                name: "Rahul Patil",
                email: "rahul@example.com",
                department: "Engineering",
                position: "Software Developer"
            },
            {
                id: 6,
                name: "Priya Sharma",
                email: "priya@example.com",
                department: "HR",
                position: "HR Executive"
            }
        ]);


        // add new emp to shared list
        function addEmployee(employee) {
            employees.value.push(employee);
        }

        //remove
        function deleteEmployee(id) {
            employees.value = employees.value.filter(
                employee => employee.id !== id
            );
        }

        onMounted(() => {
            console.log("employee management app is running");
        })

        return {
            employees, 
            addEmployee,
            deleteEmployee
        };
    },

    template: `
        <div class="app-container">
            <!-- Navigation links are handled by Vue Router -->
            <header class="app-navbar">
                <h2 class="app-brand">Employee Manager</h2>

                <nav class="app-nav-links">

                    <router-link to="/dashboard">Dashboard</router-link>
                    <router-link to="/employees">Employee</router-link>
                    <router-link to="/about">About</router-link>
                    
                </nav>
            </header>

            <main class="app-main">

                <!--
                        The current route determines which view is displayed.
                        Props pass shared data to the current view.
                        Events let a view notify the parent application.
                -->
                <router-view v-slot="{ Component }">

                    <component
                        :is="Component"
                        :employees="employees"
                        @add-employee="addEmployee"
                        @delete-employee="deleteEmployee"
                    />

                    </router-view>

            </main>

    </div>
    `
}); 


// 4. Register the router and mount Vue
// app.use() makes Vue Router available throughout the application.
app.use(router);

// Mount the application inside <div id="app"></div>.
app.mount("#app");

