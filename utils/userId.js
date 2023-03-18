const generateUserId = () => {
  const timestamp = Date.now().toString(36); // Convert current time to base 36 string
  const randomChars = Math.random().toString(36).substring(2, 12); // Generate 5 random characters
  return `${timestamp}${randomChars}`; // Combine timestamp and random characters to create unique ID
};


  

module.exports ={generateUserId}