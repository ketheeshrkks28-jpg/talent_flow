const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3001;

const publicFolder = path.join(__dirname, "public");
const dataFile = path.join(__dirname, "data.json");

function readData() {
    try {
        const data = fs.readFileSync(dataFile, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return {
            candidates: [],
            jobs: [],
            interviews: [],
            offers: [],
            onboarding: []
        };
    }
}

function saveData(data) {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });

    res.end(JSON.stringify(data));
}

function sendFile(res, filePath, contentType) {
    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404);
            res.end("File not found");
            return;
        }

        res.writeHead(200, {
            "Content-Type": contentType
        });

        res.end(content);
    });
}

function getRequestBody(req) {
    return new Promise((resolve, reject) => {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (error) {
                reject(error);
            }
        });
    });
}

const server = http.createServer(async (req, res) => {

    const url = new URL(req.url, `http://${req.headers.host}`);

    // =========================
    // GET DASHBOARD
    // =========================

    if (url.pathname === "/api/dashboard" && req.method === "GET") {

        const data = readData();

        const dashboard = {
            candidates: data.candidates.length,
            jobs: data.jobs.length,
            interviews: data.interviews.length,
            offers: data.offers.length,
            onboarding: data.onboarding.length
        };

        return sendJSON(res, 200, dashboard);
    }

    // =========================
    // CANDIDATES
    // =========================

    if (url.pathname === "/api/candidates" && req.method === "GET") {

        const data = readData();

        return sendJSON(res, 200, data.candidates);
    }

    if (url.pathname === "/api/candidates" && req.method === "POST") {

        try {

            const body = await getRequestBody(req);

            const data = readData();

            const candidate = {
                id: Date.now(),
                name: body.name,
                email: body.email,
                role: body.role,
                status: body.status || "Applied"
            };

            data.candidates.push(candidate);

            saveData(data);

            return sendJSON(res, 201, {
                message: "Candidate added successfully",
                candidate
            });

        } catch (error) {

            return sendJSON(res, 400, {
                message: "Invalid candidate data"
            });
        }
    }

    // =========================
    // JOBS
    // =========================

    if (url.pathname === "/api/jobs" && req.method === "GET") {

        const data = readData();

        return sendJSON(res, 200, data.jobs);
    }

    if (url.pathname === "/api/jobs" && req.method === "POST") {

        try {

            const body = await getRequestBody(req);

            const data = readData();

            const job = {
                id: Date.now(),
                title: body.title,
                department: body.department,
                location: body.location,
                type: body.type,
                status: body.status || "Open"
            };

            data.jobs.push(job);

            saveData(data);

            return sendJSON(res, 201, {
                message: "Job created successfully",
                job
            });

        } catch (error) {

            return sendJSON(res, 400, {
                message: "Invalid job data"
            });
        }
    }

    // =========================
// UPDATE JOB
// =========================

if (url.pathname.startsWith("/api/jobs/") && req.method === "PUT") {

    try {

        const id = Number(url.pathname.split("/")[3]);

        const body = await getRequestBody(req);

        const data = readData();

        const job = data.jobs.find(j => j.id === id);

        if (!job) {

            return sendJSON(res, 404, {
                message: "Job not found"
            });

        }

        job.title = body.title;
        job.department = body.department;
        job.location = body.location;
        job.type = body.type;
        job.status = body.status;

        saveData(data);

        return sendJSON(res, 200, {
            message: "Job updated successfully",
            job
        });

    } catch (error) {

        return sendJSON(res, 400, {
            message: "Invalid job data"
        });

    }
}


// =========================
// DELETE JOB
// =========================

if (url.pathname.startsWith("/api/jobs/") && req.method === "DELETE") {

    try {

        const id = Number(url.pathname.split("/")[3]);

        const data = readData();

        const oldLength = data.jobs.length;

        data.jobs =
            data.jobs.filter(job => job.id !== id);

        if (data.jobs.length === oldLength) {

            return sendJSON(res, 404, {
                message: "Job not found"
            });

        }

        saveData(data);

        return sendJSON(res, 200, {
            message: "Job deleted successfully"
        });

    } catch (error) {

        return sendJSON(res, 500, {
            message: "Delete failed"
        });

    }
}

    // =========================
    // INTERVIEWS
    // =========================

    if (url.pathname === "/api/interviews" && req.method === "GET") {

        const data = readData();

        return sendJSON(res, 200, data.interviews);
    }

    if (url.pathname === "/api/interviews" && req.method === "POST") {

        try {

            const body = await getRequestBody(req);

            const data = readData();

            const interview = {
                id: Date.now(),
                candidate: body.candidate,
                role: body.role,
                date: body.date,
                time: body.time,
                interviewer: body.interviewer,
                status: body.status || "Scheduled"
            };

            data.interviews.push(interview);

            saveData(data);

            return sendJSON(res, 201, {
                message: "Interview scheduled successfully",
                interview
            });

        } catch (error) {

            return sendJSON(res, 400, {
                message: "Invalid interview data"
            });
        }
    }

    // =========================
// UPDATE INTERVIEW
// =========================

if (url.pathname.startsWith("/api/interviews/") && req.method === "PUT") {

    try {

        const id = Number(url.pathname.split("/")[3]);

        const body = await getRequestBody(req);

        const data = readData();

        const interview =
            data.interviews.find(i => i.id === id);

        if (!interview) {

            return sendJSON(res, 404, {
                message: "Interview not found"
            });

        }

        interview.candidate = body.candidate;
        interview.role = body.role;
        interview.date = body.date;
        interview.time = body.time;
        interview.interviewer = body.interviewer;
        interview.status = body.status;

        saveData(data);

        return sendJSON(res, 200, {
            message: "Interview updated successfully",
            interview
        });

    } catch (error) {

        return sendJSON(res, 400, {
            message: "Invalid interview data"
        });

    }
}


// =========================
// DELETE INTERVIEW
// =========================

if (url.pathname.startsWith("/api/interviews/") && req.method === "DELETE") {

    try {

        const id = Number(url.pathname.split("/")[3]);

        const data = readData();

        const oldLength =
            data.interviews.length;

        data.interviews =
            data.interviews.filter(
                interview => interview.id !== id
            );

        if (data.interviews.length === oldLength) {

            return sendJSON(res, 404, {
                message: "Interview not found"
            });

        }

        saveData(data);

        return sendJSON(res, 200, {
            message: "Interview deleted successfully"
        });

    } catch (error) {

        return sendJSON(res, 500, {
            message: "Delete failed"
        });

    }
}

    // =========================
    // OFFERS
    // =========================

    if (url.pathname === "/api/offers" && req.method === "GET") {

        const data = readData();

        return sendJSON(res, 200, data.offers);
    }

    if (url.pathname === "/api/offers" && req.method === "POST") {

        try {

            const body = await getRequestBody(req);

            const data = readData();

            const offer = {
                id: Date.now(),
                candidate: body.candidate,
                role: body.role,
                salary: body.salary,
                joiningDate: body.joiningDate,
                status: body.status || "Pending"
            };

            data.offers.push(offer);

            saveData(data);

            return sendJSON(res, 201, {
                message: "Offer created successfully",
                offer
            });

        } catch (error) {

            return sendJSON(res, 400, {
                message: "Invalid offer data"
            });
        }
    }

    // =========================
// UPDATE OFFER
// =========================

if (url.pathname.startsWith("/api/offers/") && req.method === "PUT") {

    try {

        const id = Number(url.pathname.split("/")[3]);

        const body = await getRequestBody(req);

        const data = readData();

        const offer =
            data.offers.find(o => o.id === id);

        if (!offer) {

            return sendJSON(res, 404, {
                message: "Offer not found"
            });

        }

        offer.candidate = body.candidate;
        offer.role = body.role;
        offer.salary = body.salary;
        offer.joiningDate = body.joiningDate;
        offer.status = body.status;

        saveData(data);

        return sendJSON(res, 200, {
            message: "Offer updated successfully",
            offer
        });

    } catch (error) {

        return sendJSON(res, 400, {
            message: "Invalid offer data"
        });

    }
}


// =========================
// DELETE OFFER
// =========================

if (url.pathname.startsWith("/api/offers/") && req.method === "DELETE") {

    try {

        const id = Number(url.pathname.split("/")[3]);

        const data = readData();

        const oldLength =
            data.offers.length;

        data.offers =
            data.offers.filter(
                offer => offer.id !== id
            );

        if (data.offers.length === oldLength) {

            return sendJSON(res, 404, {
                message: "Offer not found"
            });

        }

        saveData(data);

        return sendJSON(res, 200, {
            message: "Offer deleted successfully"
        });

    } catch (error) {

        return sendJSON(res, 500, {
            message: "Delete failed"
        });

    }
}

    // =========================
    // ONBOARDING
    // =========================

    if (url.pathname === "/api/onboarding" && req.method === "GET") {

        const data = readData();

        return sendJSON(res, 200, data.onboarding);
    }

    if (url.pathname === "/api/onboarding" && req.method === "POST") {

        try {

            const body = await getRequestBody(req);

            const data = readData();

            const onboarding = {
                id: Date.now(),
                candidate: body.candidate,
                role: body.role,
                joiningDate: body.joiningDate,
                documents: body.documents || "Pending",
                status: body.status || "Not Started"
            };

            data.onboarding.push(onboarding);

            saveData(data);

            return sendJSON(res, 201, {
                message: "Onboarding record created successfully",
                onboarding
            });

        } catch (error) {

            return sendJSON(res, 400, {
                message: "Invalid onboarding data"
            });
        }
    }

    // =========================
// UPDATE ONBOARDING
// =========================

if (url.pathname.startsWith("/api/onboarding/") && req.method === "PUT") {

    try {

        const id =
            Number(url.pathname.split("/")[3]);

        const body =
            await getRequestBody(req);

        const data =
            readData();

        const item =
            data.onboarding.find(o => o.id === id);

        if (!item) {

            return sendJSON(res, 404, {
                message: "Onboarding record not found"
            });

        }

        item.candidate = body.candidate;
        item.role = body.role;
        item.joiningDate = body.joiningDate;
        item.documents = body.documents;
        item.status = body.status;

        saveData(data);

        return sendJSON(res, 200, {
            message: "Onboarding updated successfully",
            item
        });

    } catch (error) {

        return sendJSON(res, 400, {
            message: "Invalid onboarding data"
        });

    }
}


// =========================
// DELETE ONBOARDING
// =========================

if (url.pathname.startsWith("/api/onboarding/") && req.method === "DELETE") {

    try {

        const id =
            Number(url.pathname.split("/")[3]);

        const data =
            readData();

        const oldLength =
            data.onboarding.length;

        data.onboarding =
            data.onboarding.filter(
                item => item.id !== id
            );

        if (data.onboarding.length === oldLength) {

            return sendJSON(res, 404, {
                message: "Onboarding record not found"
            });

        }

        saveData(data);

        return sendJSON(res, 200, {
            message: "Onboarding deleted successfully"
        });

    } catch (error) {

        return sendJSON(res, 500, {
            message: "Delete failed"
        });

    }

}
    // =========================
// UPDATE CANDIDATE
// =========================

if (url.pathname.startsWith("/api/candidates/") && req.method === "PUT") {

    try {

        const id = Number(url.pathname.split("/")[3]);

        const body = await getRequestBody(req);

        const data = readData();

        const candidate = data.candidates.find(c => c.id === id);

        if (!candidate) {
            return sendJSON(res, 404, {
                message: "Candidate not found"
            });
        }

        candidate.name = body.name;
        candidate.email = body.email;
        candidate.role = body.role;
        candidate.status = body.status;

        saveData(data);

        return sendJSON(res, 200, {
            message: "Candidate updated successfully",
            candidate
        });

    } catch (error) {

        return sendJSON(res, 400, {
            message: "Invalid candidate data"
        });

    }
}


// =========================
// DELETE CANDIDATE
// =========================

if (url.pathname.startsWith("/api/candidates/") && req.method === "DELETE") {

    try {

        const id = Number(url.pathname.split("/")[3]);

        const data = readData();

        const oldLength = data.candidates.length;

        data.candidates =
            data.candidates.filter(candidate => candidate.id !== id);

        if (data.candidates.length === oldLength) {

            return sendJSON(res, 404, {
                message: "Candidate not found"
            });

        }

        saveData(data);

        return sendJSON(res, 200, {
            message: "Candidate deleted successfully"
        });

    } catch (error) {

        return sendJSON(res, 500, {
            message: "Delete failed"
        });

    }
}
    // =========================
    // STATIC FILES
    // =========================

    let filePath;

    if (url.pathname === "/") {
        filePath = path.join(publicFolder, "index.html");
    } else {
        filePath = path.join(publicFolder, url.pathname);
    }

    const extension = path.extname(filePath);

    const contentTypes = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/javascript",
        ".json": "application/json"
    };

    const contentType =
        contentTypes[extension] || "text/plain";

    sendFile(res, filePath, contentType);
});

server.listen(PORT, () => {

    console.log(`TalentFlow server running at http://localhost:${PORT}`);

});