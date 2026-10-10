//main page
(() => {
const {
    defineComponent,
    ref,
    reactive,
    watch,
    computed,
    onMounted,
} = Vue;

window.EmployeeView = defineComponent({

    // Register reusable components used in this template.
    components: {
        EmployeeCard: window.EmployeeCard,
        BaseModal: window.BaseModal
    },

    //parent passes this data
    props: {
        employees: {
            type: Array,
            required: true
        }
    },

    //events those can be sent back to parent 
    emits:["add-employee", "delete-employee"],

    setup(props, {emit}) {
        const searchText = ref("");
        const selectedDepartment = ref("All");

        // Controls whether the Add Employee modal is open.
        const showAddModal = ref(false);
        const showDetailsModal = ref(false);
        const selectedEmployee = ref(null);

        const formError = ref("");

        // reactive() is useful for an object containing multiple form fields.
        const form = reactive({
            name: "",
            email: "",
            department: "IT",
            position: ""
        });


        // Display a message when the page first loads.
        onMounted(() => {
            console.log("employee page mounted successfully");
        })

        //watch searchtext to understand when its value changes.
        watch(searchText, (newValue, oldValue) => {
            console.log("search change from: ", oldValue, "to: ", newValue);
        });

        //get unique dept from emp list
        const departments = computed(() => {
            const uniqueDepartments = new Set(
                props.employees.map(employee => employee.department)
            );

            return ["All", ...uniqueDepartments];
        });



        // Return employees matching both search and department filters.
        const filteredEmployees = computed(() => {
            const search = searchText.value.trim().toLowerCase();

            return props.employees.filter(employee => {
                const matchesSearch = 
                    employee.name.toLowerCase().includes(search) ||
                    employee.email.toLowerCase().includes(search) ||
                    employee.position.toLowerCase().includes(search);

                const matchesDepartment = 
                    selectedDepartment.value === "All" ||
                    employee.department === selectedDepartment.value;

                return matchesDepartment && matchesSearch;
            });
        });

        // Clear the form whenever the user opens the Add Employee modal.
        function openAddModal() {
            form.name = "";
            form.email = "";
            form.department = "IT";
            form.position = "";

            formError.value = "";
            showAddModal.value = true;
        }

        function submitEmployee() {
            formError.value = "";

            //check required things before emiting the new emp
            if (
                !form.name.trim() ||
                !form.email.trim() ||
                !form.department ||
                !form.position.trim()
            ) {
                formError.value = "Please fill in all fields.";
                return;
            }

            // Basic email format check for this practice project.
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if(!emailPattern.test(form.email.trim())) {
                formError.value = "Please enter a valid email";
                return;
            }

            //prevent duplicate email
            const emailExists = props.employees.some(employee => 
                employee.email.toLowerCase() === form.email.trim().toLowerCase()
            );

            if(emailExists) {
                formError.value = "Email Already Exists";
                return;
            }

            //create a new employee object
            const newEmployee = {
                id: Date.now(),
                name: form.name.trim(),
                email: form.email.trim(),
                department: form.department,
                position: form.position.trim()
            };

            //send new emp to parent application
            emit("add-employee", newEmployee);

            //close the form after successfull submission
            showAddModal.value = false;
        }

        function deleteEmployee(id) {

            const confirmed = window.confirm(
                "Are you sure you want to delete that employee?"
            );

            if(!confirmed) {
                return;
            }

            emit("delete-employee", id);

            // Close the details modal if the deleted employee was selected
            if(selectedEmployee.value?.id === id) {
                showDetailsModal.value = false;
                selectedEmployee.value = null;
            }
        }

        //display emp details in the modal
        function viewEmployee(employee) {
            selectedEmployee.value = employee;
            showDetailsModal.value = true;
        }

        return {
            searchText,
            selectedDepartment,
            showAddModal,
            showDetailsModal,
            selectedEmployee,
            form,
            formError,
            departments,
            filteredEmployees,
            openAddModal,
            submitEmployee,
            deleteEmployee,
            viewEmployee
        };
    },

    template: `
        <section>
            <h1 class="app-page-title">Employee</h1>

            <p class="app-muted">Search, filter, add, view and delete employee</p>

            <div class="employee-toolbar">
                <!-- v-model keeps the search input in sync with Vue state -->
                
                <input 
                    class="employee-input"
                    type="search"
                    v-model="searchText"
                    placeholder="Search by name, email or possition"
                    aria-label="Search employee"
                >

                <!-- Department options are generated dynamically -->
                <select 
                    class="employee-select"
                    v-model="selectedDepartment"
                    aria-label="filter by department"
                >
                    <option 
                        v-for="department in departments"
                        :key="department"
                        :value="department"
                    >{{department}} </option>
                </select>

                <button class="app-button" @click="openAddModal"> + Add Employee </button>
            </div>

            <p v-show="searchText" class="app-muted">
                Searching for: {{searchText}}
            </p>

            <p v-if="filteredEmployees.length === 0" class="app-empty">
                No employee match your search
            </p>

            <div v-else class="employee-grid">
                <!-- Reuse EmployeeCard for every employee -->
                    <EmployeeCard
                        v-for="employee in filteredEmployees"
                        :key="employee.id"
                        :employee="employee"
                        @delete-employee="deleteEmployee"
                        @view-employee="viewEmployee"
                    />
            </div>

            <!-- add emp modal -->


            
                <!-- Add Employee modal -->
                <BaseModal
                    v-if="showAddModal"
                    title="Add Employee"
                    @close="showAddModal = false"
                >
                    <!-- Named header slot -->
                    <template #header>
                        <h2>Add New Employee</h2>
                    </template>

                    <!-- Default slot: modal body -->
                    <form class="employee-form" @submit.prevent="submitEmployee">

                        <label>
                            Full Name
                            <input
                                v-model="form.name"
                                type="text"
                                placeholder="Enter employee name"
                                required
                            >
                        </label>

                        <label>
                            Email
                            <input
                                v-model="form.email"
                                type="email"
                                placeholder="Enter employee email"
                                required
                            >
                        </label>

                        <label>
                            Department
                            <select v-model="form.department" required>
                                <option value="IT">IT</option>
                                <option value="HR">HR</option>
                                <option value="Finance">Finance</option>
                                <option value="Engineering">Engineering</option>
                            </select>
                        </label>

                        <label>
                            Position
                            <input
                                v-model="form.position"
                                type="text"
                                placeholder="Enter employee position"
                                required
                            >
                        </label>

                        <!-- Show validation errors -->
                        <p v-if="formError" class="employee-error">
                            {{ formError }}
                        </p>

                        <p class="app-muted" :style="{ fontSize: '13px' }">
                            All fields are required.
                        </p>

                        <!-- Submit the form -->
                        <button type="submit" class="app-button">
                            Save Employee
                        </button>
                    </form>

                    <!-- Named footer slot: sibling of the form -->
                    <template #footer>
                        <button
                            type="button"
                            class="app-button app-button-secondary"
                            @click="showAddModal = false"
                        >
                            Cancel
                        </button>
                    </template>
                </BaseModal>


            <!-- Employee details modal -->
            <BaseModal
                v-if="showDetailsModal && selectedEmployee"
                title="Employee Details"
                @close="showDetailsModal=false"
            >
                <template #header>
                    <h2>{{selectedEmployee.name}}</h2>
                </template>

                <p><strong>Email: </strong> {{selectedEmployee.email}}</p>
                <p><strong>Department: </strong> {{selectedEmployee.department}}</p>
                <p><strong>Position: </strong>{{selectedEmployee.position}}</p>

                <template #footer>
                    <button
                        type="button"
                        class="app-button app-button-secondary"
                        @click="showDetailsModal = false"
                    >
                        Close
                    </button>
                </template>
                
            </BaseModal>


        </section>
    `
}); 
})();