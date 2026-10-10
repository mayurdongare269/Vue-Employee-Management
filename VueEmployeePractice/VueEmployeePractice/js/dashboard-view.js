
(() => {
const {defineComponent, computed} = Vue;

// The Dashboard displays the total number of employees and department statistics. It receives employee data from the main application through props.

window.DashboardView = defineComponent({

    props: {
        employees: {
            type: Array,
            required: true,
        }
    },

    setup(props) {

        
        // computed automatically recalculates when employee data changes.
        const totalEmployees = computed(() => {
            return props.employees.length;
        });

        const totalDepartments = computed(() => {

            //set removes duplicate records...
            const departments = new Set(
                props.employees.map(employee => employee.department)
            );

            return departments.size;
        });

        const latestEmployee = computed(() => {
            // Show the most recently added employee.
            return props.employees.length > 0 ? props.employees[props.employees.length - 1].name : "no employee yet..";
        });

        return {
            totalEmployees,
            totalDepartments,
            latestEmployee,

        };
    },

    template: `
        <section>
            <h1 class="app-page-title">Dashboard</h1>

            <p class="app-muted">
                welcome to your employee Management system
            </p>


            <div class="dashboard-grid">

                <article class="dashboard-stat">
                    <h3>Total Employees</h3>
                    <p>{{totalEmployees}}</p>
                </article>

                <article class="dashboard-stat">
                    <h3>Total Departments</h3>
                    <p>{{ totalDepartments }}</p>
                </article>

                <article class="dashboard-stat">
                    <h3>Latest Employee</h3>
                    <p>{{ latestEmployee }}</p>
                </article>

            </div>

            <p class="app-muted">
                visit the employee page to manage your team.
            </p>

        </section>
    `
});

})();


