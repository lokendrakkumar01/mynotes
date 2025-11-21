const http = require('http');

// Simple HTTP request function
function makeRequest(url, options = {}, data = null) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);

        const reqOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: options.headers || {}
        };

        const req = http.request(reqOptions, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonBody = JSON.parse(body);
                    resolve({ status: res.statusCode, data: jsonBody });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function testAPI() {
    console.log('Testing API endpoints...\n');

    try {
        // Test user registration
        console.log('1. Testing user registration...');
        const registerResponse = await makeRequest('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, {
            username: 'testuser',
            email: 'test@example.com',
            password: 'testpass'
        });

        console.log('Registration response:', registerResponse.data);

        if (registerResponse.status === 201) {
            console.log('✅ Registration successful\n');

            // Test login
            console.log('2. Testing user login...');
            const loginResponse = await makeRequest('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }, {
                username: 'testuser',
                password: 'testpass'
            });

            console.log('Login response:', loginResponse.data);

            if (loginResponse.status === 200) {
                console.log('✅ Login successful\n');
                const token = loginResponse.data.token;

                // Test files endpoint
                console.log('3. Testing files endpoint...');
                const filesResponse = await makeRequest('http://localhost:3000/api/files', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                console.log('Files endpoint response:', filesResponse.data);

                if (filesResponse.status === 200) {
                    console.log('✅ Files endpoint accessible\n');
                    console.log('🎉 All API tests passed!');
                } else {
                    console.log('❌ Files endpoint failed');
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
