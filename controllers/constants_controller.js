import constants from '../constants.js';

export const get_comments = async (req, res) => {
    // Convert BOT_MESSAGES object to array format for client-side mapping
    const botMessagesArray = Object.entries(constants.BOT_MESSAGES || {}).map(([type, message]) => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type,
        message,
        enabled: true
    }));

    return res.json({
        botNames: Array.isArray(constants.botNames) ? constants.botNames : [],
        profilePics: Array.isArray(constants.profilePics) ? constants.profilePics : [],
        messageTemplates: Array.isArray(constants.messageTemplates) ? constants.messageTemplates : [],
        reactions: Array.isArray(constants.reactions) ? constants.reactions : [],
        botMessages: botMessagesArray // Now guaranteed to be an array
    });
};

export const update_comments = async (req, res) => {
    const { commentId, updatedComment } = req.body;
    
    if (!commentId || !updatedComment) {
        return res.status(400).json({ 
            success: false, 
            message: "Comment ID and updated comment are required" 
        });
    }

    try {
        // Validate the updated comment data
        if (!updatedComment.text || typeof updatedComment.text !== 'string') {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid comment text" 
            });
        }

        return res.json({ 
            success: true, 
            message: "Comment updated successfully",
            updatedComment: {
                id: commentId,
                ...updatedComment,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Error updating comment",
            error: error.message 
        });
    }
};

export const post_comments = async (req, res) => {
    const { type, data } = req.body;
    const validTypes = ["botNames", "profilePics", "messageTemplates", "reactions", "botMessages"];

    if (!validTypes.includes(type)) {
        return res.status(400).json({ 
            success: false,
            message: "Invalid type" 
        });
    }

    try {
        if (type === "botMessages") {
            // Handle botMessages differently since it needs to be converted to object format
            const newBotMessages = {};
            if (Array.isArray(data)) {
                data.forEach(item => {
                    if (item.type && item.message) {
                        newBotMessages[item.type] = item.message;
                    }
                });
                constants.BOT_MESSAGES = newBotMessages;
            } else {
                throw new Error("botMessages data must be an array");
            }
        } else {
            // Handle array types
            if (!Array.isArray(data)) {
                return res.status(400).json({ 
                    success: false,
                    message: "Data must be an array" 
                });
            }
            constants[type] = [...data];
        }

        // Return the updated data in the correct format
        if (type === "botMessages") {
            // Convert back to array format for the response
            const botMessagesArray = Object.entries(constants.BOT_MESSAGES).map(([type, message]) => ({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                type,
                message,
                enabled: true
            }));
            return res.json({ 
                success: true, 
                message: "Bot messages updated successfully",
                data: botMessagesArray
            });
        } else {
            return res.json({ 
                success: true, 
                message: `${type} updated successfully`,
                data: constants[type]
            });
        }
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Error updating constants",
            error: error.message 
        });
    }
};

export { get_comments, update_comments, post_comments };