# Product Requirements Document (PRD): Shrthnder Web Version

## **Objective**

Develop a web-based version of Shrthnder to allow users to test and experience shorthand typing without downloading any application. The web app should:

- Provide the same features as the desktop version, including shorthand expansions and job-specific word expansions.
- Be easily navigable, user-friendly, and engaging.
- Offer additional features to test typing efficiency and make the experience game-like to encourage usage.

---

## **Scope**

Focus on creating a lightweight, accessible web application with the following core functionalities:

1. **Shorthand Expansion System**:

   - Expand predefined shorthand text into full words or phrases.
   - Support job-specific word expansions based on the selected occupation.

2. **Typing Efficiency Testing**:

   - Provide users with predefined text to type using shorthand.
   - Measure and display the time taken with and without shortcuts.

3. **Customizable Shortcuts**:

   - Allow users to view, add, and remove shortcuts.

4. **User-Friendly Interface**:

   - Provide an intuitive layout with shortcuts easily visible.
   - Include navigation for selecting an occupation and managing settings.

5. **Language Selection**:

   - Allow users to choose between English and German for the interface and shorthand rules.

6. **Usability Feedback Form**:

   - Provide a form for users to answer questions about their experience and suggest improvements.

7. **User Data Visibility**:

   - Allow administrators to view usage statistics and user input data for insights and improvement.

8. **Gamification** (Bonus Feature):

   - Add game-like elements such as scores, leaderboards, and achievements to motivate users.

---

## **Functional Requirements**

### **1. Shorthand Expansion System**

#### Description:

Expand shorthand text into full text based on predefined rules and occupation-specific configurations.

#### Implementation:

- Use a backend system (e.g., Flask or Node.js) to manage shorthand rules.
- A front-end JavaScript module dynamically replaces shorthand as the user types.

#### Example Workflow:

1. User types "btw im omw" in the input field.
2. The system detects shorthands like "btw" and "omw".
3. The input automatically updates to "by the way I'm on my way" in real time.

---

### **2. Typing Efficiency Testing**

#### Description:

Provide users with predefined text that includes shorthand and measure their typing speed.

#### Features:

- Display a text box with sample text for the user to type.
- Include a timer to measure how quickly the user types the text with and without shorthand.
- Compare and display the results.

#### Implementation:

- Use JavaScript to handle the timer and input tracking.
- Store results temporarily in the browser using localStorage or sessionStorage.

#### Example UI:

- **Text Box:** Displays the sentence to type.
- **Timer:** Shows elapsed time.
- **Results Panel:** Displays typing time with and without shorthand.

---

### **3. Customizable Shortcuts**

#### Description:

Allow users to manage their shortcuts by adding, editing, or deleting them.

#### Features:

- A sidebar showing the current shortcuts and their expansions.
- Add/remove shortcuts through a simple form.
- Save changes dynamically.

#### Example Implementation:

- **Front-End:**
  - Use a React.js or Vue.js component to render the shortcuts list and input forms.
- **Back-End:**
  - Use an API endpoint to handle CRUD operations for shortcuts.

---

### **4. User-Friendly Interface**

#### Description:

Design a clean, responsive UI to make navigation and interaction intuitive.

#### Features:

- Clear menu for switching between settings, typing test, and shortcut management.
- Responsive design for desktop and mobile devices.
- Highlight shortcuts in real time as they are typed.

---

### **5. Language Selection**

#### Description:

Allow users to select their preferred language for the application interface and shorthand rules.

#### Features:

- Dropdown menu for selecting English or German.
- Dynamically load language-specific configurations and rules.
- Default to the user's browser language if supported.

---

### **6. Usability Feedback Form**

#### Description:

Provide a feedback form to gather insights into user experience and suggestions for improvement.

#### Features:

- Questions about ease of use, feature preferences, and areas of difficulty.
- Open-text fields for additional comments.
- Submit data to a backend for review by administrators.

---

### **7. User Data Visibility**

#### Description:

Allow administrators to view aggregated user data for insights and continuous improvement.

#### Features:

- Statistics on shortcut usage, typing speeds, and user engagement.
- Exportable reports for further analysis.
- Ensure data privacy and compliance with regulations.

---

### **8. Gamification (Bonus Feature)**

#### Description:

Introduce game-like elements to motivate users.

#### Features:

- **Achievements:** Award badges for milestones (e.g., "Typed 10 sentences").
- **Leaderboards:** Show top scores for fastest typing times.
- **Progress Tracking:** Display stats such as total shortcuts used and time saved.

#### Implementation:

- Use a front-end library like Chart.js to visualize progress.
- Store scores and stats in a simple database (e.g., Firebase or MongoDB).

---

## **Non-Functional Requirements**

### **1. Performance**

- Ensure real-time shorthand expansion with minimal latency.
- Optimize for fast load times and smooth user interactions.

### **2. Accessibility**

- Make the application keyboard-friendly and screen reader-compatible.
- Ensure compatibility with all major browsers (Chrome, Firefox, Safari, Edge).

### **3. Scalability**

- Use a modular design to allow future additions like AI-based expansions or more gamification features.

### **4. Security**

- Use HTTPS for secure communication.
- Implement input validation to prevent injection attacks.

---

## **Development Plan**

### **Phase 1: Core Features**

- Implement the shorthand expansion system.
- Develop the typing efficiency test.
- Create the customizable shortcuts sidebar.

### **Phase 2: User Interface**

- Design and develop a responsive and intuitive UI.
- Integrate navigation for occupation selection, testing, and settings.

### **Phase 3: Language and Feedback Features**

- Add language selection and dynamic configuration loading.
- Develop and integrate the usability feedback form.

### **Phase 5: Gamification**

- Add achievements, leaderboards, and progress tracking.
- Integrate analytics for user engagement.

---

## **Testing Requirements**

1. **Functional Testing**:

   - Verify shorthand expansions for various test cases.
   - Ensure CRUD operations for shortcuts work as expected.

2. **Performance Testing**:

   - Measure latency in real-time text expansion.
   - Test load times and responsiveness under various conditions.

3. **UI/UX Testing**:

   - Gather user feedback on navigation and overall usability.
   - Test the interface across multiple devices and browsers.

4. **Security Testing**:

   - Validate all inputs to prevent XSS and injection attacks.
   - Test secure handling of user data.

---

