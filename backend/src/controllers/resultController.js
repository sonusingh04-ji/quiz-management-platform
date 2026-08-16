const resultService =
    require("../services/resultService");

// =====================================================
// Save Result
// =====================================================
const saveResult = async (req, res) => {

    try {

        const user_id = req.user.id;

        const {
            quiz_id,
            attempt_id,
            total_questions,
            correct_answers,
            wrong_answers,
            percentage
        } = req.body;


        const result =
            await resultService.saveResult(
                user_id,
                quiz_id,
                attempt_id,
                total_questions,
                correct_answers,
                wrong_answers,
                percentage
            );


        res.status(201).json({
            success: true,
            message: "Result Saved Successfully",
            data: result
        });

    } catch (error) {

        console.error(
            "Save Result Error:",
            error
        );

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// Get All Results
// Admin Only
// =====================================================
const getAllResults = async (req, res) => {

    try {

        const results =
            await resultService.getAllResults();


        res.status(200).json({
            success: true,
            data: results
        });

    } catch (error) {

        console.error(
            "Get All Results Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// Get My Results
// Student Only
// =====================================================
const getMyResults = async (req, res) => {

    try {

        // Get logged-in student's ID
        const userId = req.user.id;


        const results =
            await resultService.getResultsByUser(
                userId
            );


        res.status(200).json({
            success: true,
            message:
                "Your results fetched successfully",
            data: results
        });

    } catch (error) {

        console.error(
            "Get My Results Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// Get Result By ID
// =====================================================
const getResultById = async (req, res) => {

    try {

        const { id } = req.params;

        const result =
            await resultService.getResultById(id);


        if (!result) {

            return res.status(404).json({
                success: false,
                message: "Result not found."
            });
        }


        // =================================================
        // SECURITY CHECK
        // =================================================

        const isAdmin =
            req.user.role === "admin";


        const isOwner =
            String(result.user_id) ===
            String(req.user.id);


        if (!isAdmin && !isOwner) {

            return res.status(403).json({
                success: false,
                message:
                    "You are not allowed to view this result."
            });
        }


        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        console.error(
            "Get Result By ID Error:",
            error
        );

        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// Delete Result
// Admin Only
// =====================================================
const deleteResult = async (req, res) => {

    try {

        const { id } = req.params;


        await resultService.deleteResult(id);


        res.status(200).json({
            success: true,
            message:
                "Result Deleted Successfully"
        });

    } catch (error) {

        console.error(
            "Delete Result Error:",
            error
        );

        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// Export
// =====================================================

module.exports = {

    saveResult,

    getAllResults,

    getMyResults,

    getResultById,

    deleteResult

};