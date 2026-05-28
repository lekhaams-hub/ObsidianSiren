const { db, admin } = require("../config/firebaseAdmin");
const sendEmail = require("../utils/sendEmail");

const getAdminEmails = () => {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
};

const createSubmission = async (req, res) => {
  try {
    const {
      name,
      email,
      title,
      message,
      manuscriptType,
      phone,
      fileName,
      filePath,
    } = req.body;

    if (!name || !email || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "name, email, title, and message are required.",
      });
    }

    const submissionData = {
      name,
      email,
      title,
      message,
      manuscriptType: manuscriptType || "",
      phone: phone || "",
      fileName: fileName || "",
      filePath: filePath || "",
      status: "submitted",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("submissions").add(submissionData);

    // USER EMAIL
    try {
      await sendEmail({
        to: email,
        subject: "We received your request",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Hello ${name},</h2>
            <p>Thank you for submitting your request.</p>
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Reference ID:</strong> ${docRef.id}</p>
            <p>We will review it and contact you soon.</p>
          </div>
        `,
      });

      console.log("User email sent successfully");
    } catch (error) {
      console.error("User email failed:", error);
    }

    // ADMIN EMAIL
    const adminEmails = getAdminEmails();

    console.log("Admin emails:", adminEmails);

    if (adminEmails.length > 0) {
      try {
        await sendEmail({
          to: adminEmails.join(","),
          subject: "New submission received",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>New submission received</h2>

              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || "N/A"}</p>
              <p><strong>Title:</strong> ${title}</p>
              <p><strong>Type:</strong> ${manuscriptType || "N/A"}</p>
              <p><strong>Message:</strong> ${message}</p>
              <p><strong>File Name:</strong> ${fileName || "N/A"}</p>

              <p><strong>Reference ID:</strong> ${docRef.id}</p>
            </div>
          `,
        });

        console.log("Admin email sent successfully");
      } catch (error) {
        console.error("Admin email failed:", error);
      }
    } else {
      console.log("No admin emails found in .env");
    }

    return res.status(201).json({
      success: true,
      message: "Submission created successfully.",
      submissionId: docRef.id,
    });
  } catch (error) {
    console.error("Create submission error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create submission.",
      error: error.message,
    });
  }
};

const getSubmissions = async (req, res) => {
  try {
    const snapshot = await db
      .collection("submissions")
      .orderBy("createdAt", "desc")
      .get();

    const submissions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    console.error("Get submissions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch submissions.",
      error: error.message,
    });
  }
};

const updateSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Submission id is required.",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    const allowedStatuses = [
      "submitted",
      "approved",
      "rejected",
      "reviewed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value.",
      });
    }

    const ref = db.collection("submissions").doc(id);

    const doc = await ref.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "Submission not found.",
      });
    }

    const submission = doc.data();

    await ref.update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    let subject = "Your submission status has been updated";

    let bodyMessage =
      `Your submission status has been updated to: ${status}.`;

    if (status === "approved") {
      subject = "Your submission has been approved";

      bodyMessage =
        "Good news — your submission has been approved.";
    } else if (status === "rejected") {
      subject = "Your submission has been rejected";

      bodyMessage =
        "Thank you for your submission. After review, this submission has been rejected.";
    }

    sendEmail({
      to: submission.email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Hello ${submission.name || "Client"},</h2>

          <p>${bodyMessage}</p>

          <p><strong>Title:</strong> ${submission.title || "N/A"}</p>

          <p><strong>Current Status:</strong> ${status}</p>
        </div>
      `,
    }).catch((error) => {
      console.error("Status email send failed:", error);
    });

    return res.status(200).json({
      success: true,
      message: "Submission status updated successfully.",
    });
  } catch (error) {
    console.error("Update submission status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update submission status.",
      error: error.message,
    });
  }
};

module.exports = {
  createSubmission,
  getSubmissions,
  getAllSubmissions: getSubmissions,
  updateSubmissionStatus,
};