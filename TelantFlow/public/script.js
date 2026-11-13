const API = "/api";


// =================================================
// DASHBOARD
// =================================================

async function loadDashboard() {

    try {

        const response =
            await fetch(`${API}/dashboard`);

        const data =
            await response.json();


        const candidateCount =
            document.getElementById("candidateCount");

        const jobCount =
            document.getElementById("jobCount");

        const interviewCount =
            document.getElementById("interviewCount");

        const offerCount =
            document.getElementById("offerCount");


        if (candidateCount)
            candidateCount.textContent = data.candidates;

        if (jobCount)
            jobCount.textContent = data.jobs;

        if (interviewCount)
            interviewCount.textContent = data.interviews;

        if (offerCount)
            offerCount.textContent = data.offers;

    } catch (error) {

        console.log("Dashboard error:", error);

    }
}


// =================================================
// CANDIDATES
// =================================================

let candidates = [];


async function loadCandidates() {

    const response =
        await fetch(`${API}/candidates`);

    candidates =
        await response.json();

    displayCandidates(candidates);

    updateCandidateCounts();
}

function displayCandidates(data) {

    const list = document.getElementById("candidateList");

    if (!list) return;

    list.innerHTML = "";

    data.forEach(candidate => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${candidate.name}</td>

            <td>${candidate.email}</td>

            <td>${candidate.role}</td>

            <td>
                <span class="${getStatusClass(candidate.status)}">
                    ${candidate.status}
                </span>
            </td>

            <td>

                <button
                    onclick="editCandidate(${candidate.id})"
                    class="edit-btn">
                    ✏️ Edit
                </button>

                <button
                    onclick="deleteCandidate(${candidate.id})"
                    class="delete-btn">
                    🗑️ Delete
                </button>

            </td>
        `;

        list.appendChild(row);
    });
}


function updateCandidateCounts() {

    const total =
        document.getElementById("total");

    const selected =
        document.getElementById("selectedCount");

    const interview =
        document.getElementById("interviewCandidates");


    if (total)
        total.textContent = candidates.length;


    if (selected) {

        selected.textContent =
            candidates.filter(
                c => c.status === "Selected"
            ).length;

    }


    if (interview) {

        interview.textContent =
            candidates.filter(
                c => c.status === "Interview"
            ).length;

    }
}


function searchCandidates() {

    const input =
        document.getElementById("search");

    if (!input) return;


    const keyword =
        input.value.toLowerCase();


    const filtered =
        candidates.filter(candidate =>

            candidate.name
                .toLowerCase()
                .includes(keyword)

            ||

            candidate.email
                .toLowerCase()
                .includes(keyword)

            ||

            candidate.role
                .toLowerCase()
                .includes(keyword)

        );


    displayCandidates(filtered);
}


function showCandidateForm() {

    const form =
        document.getElementById("candidateForm");

    if (form)
        form.classList.toggle("hidden");
}


async function addCandidate() {

    const name =
        document.getElementById("candidateName")?.value;

    const email =
        document.getElementById("candidateEmail")?.value;

    const role =
        document.getElementById("candidateRole")?.value;

    const status =
        document.getElementById("candidateStatus")?.value;


    if (!name || !email || !role) {

        alert("Please fill all candidate details.");

        return;
    }


    const response =
        await fetch(`${API}/candidates`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                role,
                status
            })

        });


    const result =
        await response.json();


    alert(result.message);


    if (response.ok) {

        document.getElementById("candidateName").value = "";
        document.getElementById("candidateEmail").value = "";
        document.getElementById("candidateRole").value = "";

        loadCandidates();

    }
}

async function deleteCandidate(id) {
    const confirmDelete =
        confirm("Are you sure you want to delete this candidate?");

    if (!confirmDelete) {
        return;
    }

    const response =
        await fetch(`${API}/candidates/${id}`, {
            method: "DELETE"
        });

    const result = await response.json();

    alert(result.message);

    if (response.ok) {
        loadCandidates();
        loadDashboard();
    }
}

async function editCandidate(id) {

    const candidate = candidates.find(c => c.id === id);

    if (!candidate) {
        return;
    }

    const name = prompt("Enter candidate name:", candidate.name);
    if (name === null) return;

    const email = prompt("Enter email:", candidate.email);
    if (email === null) return;

    const role = prompt("Enter job role:", candidate.role);
    if (role === null) return;

    const status = prompt(
        "Enter status (Applied / Interview / Selected / Rejected):",
        candidate.status
    );

    if (status === null) return;

    const response = await fetch(`${API}/candidates/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            role,
            status
        })
    });

    const result = await response.json();

    alert(result.message);

    if (response.ok) {
        loadCandidates();
        loadDashboard();
    }
}

// =================================================
// JOBS
// =================================================

async function loadJobs() {

    const response =
        await fetch(`${API}/jobs`);

    const jobs =
        await response.json();


    const list =
        document.getElementById("jobList");

    if (!list) return;


    list.innerHTML = "";


    jobs.forEach(job => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${job.title}</td>

            <td>${job.department}</td>

            <td>${job.location}</td>

            <td>${job.type}</td>

            <td>
                <span class="open">
                    ${job.status}
                </span>
            </td>

            <td>

        <button onclick="editJob(${job.id})"
            class="edit-btn">
            ✏️ Edit
        </button>

        <button
            onclick="deleteJob(${job.id})"
            class="delete-btn">
            🗑️ Delete
        </button>

    </td>


   `;


        list.appendChild(row);

    });
}


function showJobForm() {

    const form =
        document.getElementById("jobForm");

    if (form)
        form.classList.toggle("hidden");
}


async function addJob() {

    const title =
        document.getElementById("jobTitle").value;

    const department =
        document.getElementById("department").value;

    const location =
        document.getElementById("location").value;

    const type =
        document.getElementById("jobType").value;


    if (!title || !department || !location) {

        alert("Please fill all job details.");

        return;
    }


    const response =
        await fetch(`${API}/jobs`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title,
                department,
                location,
                type
            })

        });


    const result =
        await response.json();


    alert(result.message);


    if (response.ok) {

        loadJobs();

    }
}

async function editJob(id) {

    const response =
        await fetch(`${API}/jobs`);

    const jobs =
        await response.json();

    const job =
        jobs.find(j => j.id === id);

    if (!job) {
        return;
    }

    const title =
        prompt("Enter job title:", job.title);

    if (title === null) return;

    const department =
        prompt("Enter department:", job.department);

    if (department === null) return;

    const location =
        prompt("Enter location:", job.location);

    if (location === null) return;

    const type =prompt(
            "Enter job type (Full Time / Part Time / Internship):",
            job.type
        );

    if (type === null) return;

    const status =
        prompt(
            "Enter status (Open / Closed):",
            job.status
        );

    if (status === null) return;


    const updateResponse =
        await fetch(`${API}/jobs/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title,
                department,
                location,
                type,
                status
            })

        });


    const result =
        await updateResponse.json();

    alert(result.message);

    if (updateResponse.ok) {

        loadJobs();
        loadDashboard();

    }
}

async function deleteJob(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this job?");

    if (!confirmDelete) {
        return;
    }

    const response =
        await fetch(`${API}/jobs/${id}`, {

            method: "DELETE"

        });

    const result =
        await response.json();

    alert(result.message);

    if (response.ok) {

        loadJobs();
        loadDashboard();

    }
}


// =================================================
// INTERVIEWS
// =================================================

async function loadInterviews() {

    const response =
        await fetch(`${API}/interviews`);

    const interviews =
        await response.json();


    const list =
        document.getElementById("interviewList");

    if (!list) return;


    list.innerHTML = "";


    interviews.forEach(item => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${item.candidate}</td>

            <td>${item.role}</td>

            <td>${item.date}</td>

            <td>${item.time}</td>

            <td>${item.interviewer}</td>

            <td>
                <span class="scheduled">
                    ${item.status}
                </span>
            </td>

            <td>

    <button
        onclick="editInterview(${item.id})"
        class="edit-btn">
        ✏️ Edit
    </button>

    <button
        onclick="deleteInterview(${item.id})"
        class="delete-btn">
        🗑️ Delete
    </button>

</td>

        `;


        list.appendChild(row);

    });
}


function showInterviewForm() {

    const form =
        document.getElementById("interviewForm");

    if (form)
        form.classList.toggle("hidden");
}


async function addInterview() {

    const candidate =
        document.getElementById("interviewCandidate").value;

    const role =
        document.getElementById("interviewRole").value;

    const date =
        document.getElementById("interviewDate").value;

    const time =
        document.getElementById("interviewTime").value;

    const interviewer =
        document.getElementById("interviewer").value;


    if (!candidate || !role || !date || !time || !interviewer) {

        alert("Please fill all interview details.");

        return;
    }


    const response =
        await fetch(`${API}/interviews`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                candidate,
                role,
                date,
                time,
                interviewer
            })

        });


    const result =
        await response.json();


    alert(result.message);


    if (response.ok) {

        loadInterviews();

    }
}




// =========================
// EDIT INTERVIEW
// =========================

async function editInterview(id) {

    const response =
        await fetch(`${API}/interviews`);

    const interviews =
        await response.json();

    const interview =
        interviews.find(i => i.id === id);

    if (!interview) {
        return;
    }


    const candidate =
        prompt(
            "Enter candidate name:",
            interview.candidate
        );

    if (candidate === null) return;


    const role =
        prompt(
            "Enter job role:",
            interview.role
        );

    if (role === null) return;


    const date =
        prompt(
            "Enter interview date:",
            interview.date
        );

    if (date === null) return;


    const time =
        prompt(
            "Enter interview time:",
            interview.time
        );

    if (time === null) return;


    const interviewer =
        prompt(
            "Enter interviewer name:",
            interview.interviewer
        );

    if (interviewer === null) return;


    const status =
        prompt(
            "Enter status:",
            interview.status
        );

    if (status === null) return;


    const updateResponse =
        await fetch(`${API}/interviews/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                candidate,
                role,
                date,
                time,
                interviewer,
                status
            })

        });


    const result =
        await updateResponse.json();

    alert(result.message);


    if (updateResponse.ok) {

        loadInterviews();
        loadDashboard();

    }

}




// =================================================
// OFFERS
// =================================================

async function loadOffers() {

    const response =
        await fetch(`${API}/offers`);

    const offers =
        await response.json();


    const list =
        document.getElementById("offerList");

    if (!list) return;


    list.innerHTML = "";


    offers.forEach(offer => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${offer.candidate}</td>

            <td>${offer.role}</td>

            <td>${offer.salary}</td>

            <td>${offer.joiningDate}</td>

            <td>
                <span class="selected">
                    ${offer.status}
                </span>
            </td>

            <td>

    <button
        onclick="editOffer(${offer.id})"
        class="edit-btn">
        ✏️ Edit
    </button>

    <button
        onclick="deleteOffer(${offer.id})"
        class="delete-btn">
        🗑️ Delete
    </button>

</td>

        `;


        list.appendChild(row);

    });
}


function showOfferForm() {

    const form =
        document.getElementById("offerForm");

    if (form)
        form.classList.toggle("hidden");
}


async function addOffer() {

    const candidate =
        document.getElementById("offerCandidate").value;

    const role =
        document.getElementById("offerRole").value;

    const salary =
        document.getElementById("offerSalary").value;

    const joiningDate =
        document.getElementById("joiningDate").value;


    if (!candidate || !role || !salary || !joiningDate) {

        alert("Please fill all offer details.");

        return;
    }


    const response =
        await fetch(`${API}/offers`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                candidate,
                role,
                salary,
                joiningDate
            })

        });


    const result =
        await response.json();


    alert(result.message);


    if (response.ok) {

        loadOffers();

    }
}

// =========================
// EDIT OFFER
// =========================

async function editOffer(id) {

    const response =
        await fetch(`${API}/offers`);

    const offers =
        await response.json();

    const offer =
        offers.find(o => o.id === id);

    if (!offer) {
        return;
    }

    const candidate =
        prompt(
            "Enter candidate name:",
            offer.candidate
        );

    if (candidate === null) return;

    const role =
        prompt(
            "Enter job role:",
            offer.role
        );

    if (role === null) return;

    const salary =
        prompt(
            "Enter salary:",
            offer.salary
        );

    if (salary === null) return;

    const joiningDate =
        prompt(
            "Enter joining date:",
            offer.joiningDate
        );

    if (joiningDate === null) return;

    const status =
        prompt(
            "Enter status:",
            offer.status
        );

    if (status === null) return;


    const updateResponse =
        await fetch(`${API}/offers/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                candidate,
                role,
                salary,
                joiningDate,
                status
            })

        });


    const result =
        await updateResponse.json();

    alert(result.message);


    if (updateResponse.ok) {

        loadOffers();
        loadDashboard();

    }
}


// =========================
// DELETE OFFER
// =========================

async function deleteOffer(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this offer?"
        );

    if (!confirmDelete) {
        return;
    }


    const response =
        await fetch(`${API}/offers/${id}`, {

            method: "DELETE"

        });


    const result =
        await response.json();

    alert(result.message);


    if (response.ok) {

        loadOffers();
        loadDashboard();

    }

}



// =================================================
// ONBOARDING
// =================================================

async function loadOnboarding() {

    const response =
        await fetch(`${API}/onboarding`);

    const onboarding =
        await response.json();


    const list =
        document.getElementById("onboardingList");

    if (!list) return;


    list.innerHTML = "";


    onboarding.forEach(item => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${item.candidate}</td>

            <td>${item.role}</td>

            <td>${item.joiningDate}</td>

            <td>${item.documents}</td>

            <td>
                <span class="inprogress">
                    ${item.status}
                </span>
            </td>

        

        <td>

    <button
        onclick="editOnboarding(${item.id})"
        class="edit-btn">
        ✏️ Edit
    </button>

    <button
        onclick="deleteOnboarding(${item.id})"
        class="delete-btn">
        🗑️ Delete
    </button>

</td>

`;

// =========================
// EDIT ONBOARDING
// =========================

async function editOnboarding(id) {

    const response =
        await fetch(`${API}/onboarding`);

    const onboarding =
        await response.json();

    const item =
        onboarding.find(o => o.id === id);

    if (!item) {
        return;
    }

    const candidate =
        prompt(
            "Enter candidate name:",
            item.candidate
        );

    if (candidate === null) return;

    const role =
        prompt(
            "Enter job role:",
            item.role
        );

    if (role === null) return;

    const joiningDate =
        prompt(
            "Enter joining date:",
            item.joiningDate
        );

    if (joiningDate === null) return;

    const documents =
        prompt(
            "Enter documents status:",
            item.documents
        );

    if (documents === null) return;

    const status =
        prompt(
            "Enter onboarding status:",
            item.status
        );

    if (status === null) return;


    const updateResponse =
        await fetch(`${API}/onboarding/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                candidate,
                role,
                joiningDate,
                documents,
                status
            })

        });


    const result =
        await updateResponse.json();

    alert(result.message);


    if (updateResponse.ok) {

        loadOnboarding();
        loadDashboard();

    }

}


// =========================
// DELETE ONBOARDING
// =========================

async function deleteOnboarding(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this onboarding?"
        );

    if (!confirmDelete) {
        return;
    }


    const response =
        await fetch(`${API}/onboarding/${id}`, {

            method: "DELETE"

        });


    const result =
        await response.json();

    alert(result.message);


    if (response.ok) {

        loadOnboarding();
        loadDashboard();

    }

}


        list.appendChild(row);

    });
}


function showOnboardingForm() {

    const form =
        document.getElementById("onboardingForm");

    if (form)
        form.classList.toggle("hidden");
}


async function addOnboarding() {

    const candidate =
        document.getElementById("onboardCandidate").value;

    const role =
        document.getElementById("onboardRole").value;

    const joiningDate =
        document.getElementById("onboardDate").value;

    const documents =
        document.getElementById("documents").value;


    if (!candidate || !role || !joiningDate) {

        alert("Please fill all onboarding details.");

        return;
    }


    const response =
        await fetch(`${API}/onboarding`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                candidate,
                role,
                joiningDate,
                documents
            })

        });


    const result =
        await response.json();


    alert(result.message);


    if (response.ok) {

        loadOnboarding();

    }
}


// =================================================
// STATUS CLASS
// =================================================

function getStatusClass(status) {

    if (status === "Interview")
        return "interview";

    if (status === "Selected")
        return "selected";

    if (status === "Rejected")
        return "rejected";

    return "applied";
}


// =================================================
// PAGE LOAD
// =================================================

document.addEventListener("DOMContentLoaded", () => {

    loadDashboard();

    loadCandidates();

    loadJobs();

    loadInterviews();

    loadOffers();

    loadOnboarding();

});