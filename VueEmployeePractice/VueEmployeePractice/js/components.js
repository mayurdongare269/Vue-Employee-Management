// this file content 2 reusable Components... 
// EmployeeCard — displays one employee.
// BaseModal — displays content inside a popup.

const {defineComponent} = Vue;

//1. emp card
window.EmployeeCard = defineComponent({

    // Props allow the parent to pass employee data to this component.
    props: {
        employee: {
            type: Object,
            required: true,
        }
    },

    // Declare the events that this component can emit to its parent.
    emits: ["delete-employee", "view-employee"],

    template: `

        <article class="employee-card">

        <!-- Display employee details received through props... -->
        <h3>{{employee.name}}</h3>
        
        <p>
            <strong>Email: </strong>
            {{employee.email}}
        </p>

        <p>
            <strong>Department: </strong>
            {{employee.department}}
        </p>

        <p>
            <strong>Position: </strong>
            {{employee.position}}
        </p>

        <div class="employee-action">

            <!-- Send the employee object to the parent -->
            <button class="app-button" @click="$emit('view-employee', employee)">
                View Details
            </button>

            <!-- send emp id to parent -->
            <button class="app-button app-button-danger" @click="$emit('delete-employee', employee.id)">
                Delete 
            </button>

        </div>

    </article>

    `

});

window.BaseModal = defineComponent({

    props: {
        title: {
            type: String,
            default: "Information"
        }
    },

    // The close event tells the parent that the user wants to close the modal.
    emits: ["close"],

    template: `

        <div class="modal-backdrop" @click.self="$emit('close')">

            <section class="modal-panel">

                <header class="modal-header">

                    <!-- Named slot: parent can provide its own header -->

                    <div>
                        <slot name="header">
                            <h2>{{title }}</h2>
                        </slot>
                    </div>

                    <button
                        class="app-button app-button-secondary"
                        @click="$emit('close')"
                        aria-label="Close dialog"
                    >
                        X
                    </button>

                </header>


                <main>
                 <!-- Default slot: parent inserts the main content here -->
                    <slot>
                        <p>No Content Provided...</p>
                    </slot>
                </main>

                <footer class="modal-footer">

                    <!-- Named slot: parent can customize the footer -->
                    <slot name="footer">
                        <button
                            class="app-button app-button-secondary"
                            @click="$emit('close')"
                        >
                            Close
                        </button>
                    </slot>

                </footer>

            </section>

        </div>
        

    `

});