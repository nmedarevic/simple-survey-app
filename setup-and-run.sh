#!/bin/bash

# Function to check if command succeeded
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "$1 completed successfully${NC}"
    else
        echo -e "$1 failed${NC}"
        exit 1
    fi
}

# Step 1: Install root dependencies
echo -e "[1/5] Installing root dependencies...${NC}"
npm install
check_status "Root npm install"
echo ""

# Step 2: Install client dependencies
echo -e "[2/5] Installing client dependencies...${NC}"
cd client
npm install
check_status "Client npm install"
cd ..
echo ""

# Step 3: Install server dependencies
echo -e "[3/5] Installing server dependencies...${NC}"
cd server
npm install
check_status "Server npm install"
echo ""

# Step 4: Seed the database
echo -e "[4/5] Seeding the database...${NC}"
npm run seed
check_status "Database seeding"
cd ..
echo ""

# Step 5: Run both client and server
echo -e "[5/5] Starting development servers...${NC}"
echo -e "Starting client on http://localhost:5173${NC}"
echo -e "Starting server on http://localhost:4000${NC}"
echo ""
echo -e "Press Ctrl+C to stop both servers${NC}"
echo ""

# Run both servers in parallel
npm run dev --prefix client & npm run dev --prefix server &

# Wait for both processes
wait

