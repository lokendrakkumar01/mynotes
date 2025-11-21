const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
    console.log('Testing API endpoints...\n');

    try {
        // Test user registration
        console.log('1. Testing user registration...');
        const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'testuser',
                email: 'test@example.com',
                password: 'testpass'
            })
        });

        const registerData = await registerResponse.json();
        console.log('Registration response:', registerData);

        if (registerResponse.ok) {
            console.log('✅ Registration successful\n');

            // Test login
            console.log('2. Testing user login...');
            const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: 'testuser',
                    password: 'testpass'
                })
            });

            const loginData = await loginResponse.json();
            console.log('Login response:', loginData);

            if (loginResponse.ok) {
                console.log('✅ Login successful\n');
                const token = loginData.token;

                // Test file upload (create a simple text file)
                console.log('3. Testing file upload...');
                const fs = require('fs');
                const FormData = require('form-data');

                // Create a test file
                fs.writeFileSync('test-file.txt', 'This is a test file for upload.');

                const formData = new FormData();
                formData.append('file', fs.createReadStream('test-file.txt'));

                const uploadResponse = await fetch(`${API_BASE_URL}/files/upload`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                const uploadData = await uploadResponse.json();
                console.log('Upload response:', uploadData);

                if (uploadResponse.ok) {
                    console.log('✅ File upload successful\n');

                    // Test get files
                    console.log('4. Testing get files...');
                    const filesResponse = await fetch(`${API_BASE_URL}/files`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const filesData = await filesResponse.json();
                    console.log('Files response:', filesData);

                    if (filesResponse.ok) {
                        console.log('✅ Get files successful\n');
                        console.log('🎉 All API tests passed!');
                    } else {
                        console.log('❌ Get files failed');
                    }

                    // Clean up test file
                    fs.unlinkSync('test-file.txt');

                } else {
                    console.log('❌ File upload failed');
                }

            } else {
                console.log('❌ Login failed');
            }

        } else {
            console.log('❌ Registration failed');
        }

    } catch (error) {
        console.error('Test error:', error);
    }
}

testAPI();
