def test_login_inspector_success(client):
    response = client.post(
        "/api/v1/auth/login/json",
        json={"email": "inspector@shram.gov.in", "password": "Inspector@123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "inspector"
    assert data["name"] == "S. K. Sharma"


def test_login_employer_success(client):
    response = client.post(
        "/api/v1/auth/login/json",
        json={"email": "employer@abcindustries.com", "password": "Employer@123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "employer"
    assert data["name"] == "Rajiv Mehra"


def test_login_invalid_password(client):
    response = client.post(
        "/api/v1/auth/login/json",
        json={"email": "inspector@shram.gov.in", "password": "WrongPassword!"},
    )
    assert response.status_code == 401


def test_get_current_user_profile(client):
    # Login first
    login_res = client.post(
        "/api/v1/auth/login/json",
        json={"email": "inspector@shram.gov.in", "password": "Inspector@123"},
    )
    token = login_res.json()["access_token"]

    # Access protected /me endpoint
    me_res = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_res.status_code == 200
    profile = me_res.json()
    assert profile["email"] == "inspector@shram.gov.in"
    assert profile["role"] == "inspector"
    assert profile["designation"] == "Assistant Labour Commissioner (Central)"


def test_unauthenticated_profile_access(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
