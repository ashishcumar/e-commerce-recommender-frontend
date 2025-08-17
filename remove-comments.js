// remove-comments.js

import fs from 'fs';
import path from 'path';

// Define the root directory of your React project's 'src' folder
// Adjust this path if your script is not in the root of your frontend folder
const srcDir = path.join(process.cwd(), 'src'); // Use process.cwd() for current working directory

/**
 * Removes comments from a given string content.
 * Handles single-line (//) and multi-line (/* *) comments.
 * @param {string} content - The file content as a string.
 * @returns {string} The content with comments removed.
 */
function removeComments(content) {
    // Regex to match multi-line comments (/* ... */)
    // The /s flag allows . to match newlines.
    content = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, function(match) {
        // If it's a multi-line comment, replace with newlines to preserve line numbers
        // This is important for debugging if you ever need to map back to original lines
        if (match.startsWith('/*')) {
            return match.split('\n').map(() => '').join('\n'); // Replace with empty lines
        }
        // If it's a single-line comment, replace with empty string
        return '';
    });
    return content;
}

/**
 * Recursively processes files in a directory.
 * @param {string} directory - The current directory to process.
 */
function processDirectory(directory) {
    fs.readdirSync(directory, { withFileTypes: true }).forEach(dirent => {
        const fullPath = path.join(directory, dirent.name);

        if (dirent.isDirectory()) {
            // Recursively call for subdirectories, but skip node_modules
            if (dirent.name === 'node_modules') {
                console.log(`Skipping node_modules: ${fullPath}`);
                return;
            }
            processDirectory(fullPath);
        } else if (dirent.isFile()) {
            // Process only .js, .jsx, .css files
            if (/\.(js|jsx|css)$/.test(dirent.name)) {
                try {
                    let content = fs.readFileSync(fullPath, 'utf8');
                    const originalContentLength = content.length;

                    content = removeComments(content);

                    if (content.length !== originalContentLength) { // Only write if content changed
                        fs.writeFileSync(fullPath, content, 'utf8');
                        console.log(`Cleaned comments from: ${fullPath}`);
                    } else {
                        // console.log(`No comments found or changes made in: ${fullPath}`);
                    }
                } catch (error) {
                    console.error(`Error processing file ${fullPath}: ${error.message}`);
                }
            }
        }
    });
}

console.log(`Starting comment removal in: ${srcDir}`);
if (fs.existsSync(srcDir)) {
    processDirectory(srcDir);
    console.log('Comment removal complete! 🎉');
} else {
    console.error(`Error: Source directory not found at ${srcDir}`);
}