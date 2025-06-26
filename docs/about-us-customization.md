# About Us Page Customization Guide

This guide will help you customize the About Us page with your actual team information and photos.

## 📁 Files to Update

### 1. Main About Us Page

**File**: `/src/pages/AboutUs.jsx`

### 2. Team Member Photos

**Directory**: `/src/assets/images/team/`

## 🖼️ Adding Team Member Photos

### Step 1: Add Your Photos

1. Navigate to `/src/assets/images/team/` directory
2. Add your team member photos (JPG, PNG, or WebP format)
3. Recommended size: 300x300 pixels
4. Name files descriptively (e.g., `john_doe.jpg`, `sarah_smith.png`)

### Step 2: Update Team Data

Edit the `teamMembers` array in `/src/pages/AboutUs.jsx`:

```javascript
const teamMembers = [
  {
    id: 1,
    name: "Your Actual Name",
    role: "Your Role (e.g., Frontend Developer)",
    image: "/src/assets/images/team/your_photo.jpg",
    description: "Brief description of your contribution to the project.",
  },
  // Add more team members...
];
```

## 🎨 Customization Options

### Update Project Description

Change the mission statement and project description in the hero section:

```javascript
<p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
  Your custom project description here...
</p>
```

### Modify Features

Update the three feature cards in the mission section to reflect your project's key features.

### Add/Remove Team Members

- **To add**: Copy an existing team member object and update the details
- **To remove**: Delete the team member object from the array
- **To reorder**: Change the `id` values or rearrange the array

## 🔧 Technical Notes

### Image Loading

- If a team member image fails to load, it automatically falls back to a generated avatar
- The fallback uses the team member's name to create a colored avatar
- No additional configuration needed for the fallback system

### Responsive Design

- The page is fully responsive
- Team member grid adjusts from 1 column (mobile) to 3 columns (desktop)
- All sections are optimized for different screen sizes

### Navigation

- The "About Us" link in the navbar now correctly routes to `/about`
- Works in both desktop and mobile navigation menus

## 📊 Team Member Grid Layout

The current setup displays team members in a responsive grid:

- **Mobile**: 1 column
- **Tablet**: 2 columns
- **Desktop**: 3 columns

Each team member card includes:

- Profile photo (128x128 rounded)
- Name
- Role (colored with brand colors)
- Description

## 🎯 Quick Start Checklist

- [ ] Add team member photos to `/src/assets/images/team/`
- [ ] Update team member names in the `teamMembers` array
- [ ] Update team member roles
- [ ] Write descriptions for each team member
- [ ] Update image paths to point to your actual photos
- [ ] Customize the project description and mission statement
- [ ] Test the page in development mode
- [ ] Verify navigation links work correctly

## 🚀 Running the Updated Page

After making your changes:

1. Save all files
2. If the development server is running, changes should appear automatically
3. If not running, start it with: `npm run dev`
4. Navigate to `http://localhost:5173/about` to view your About Us page

## 💡 Tips

1. **Keep descriptions concise**: Aim for 1-2 sentences per team member
2. **Use consistent photo style**: Try to use similar lighting/background for all photos
3. **Update regularly**: Add new team members as your project grows
4. **Test thoroughly**: Check the page on different devices and screen sizes

## 🐛 Troubleshooting

**Images not loading?**

- Check file paths are correct
- Ensure images are in the correct directory
- Verify file extensions match what's in the code

**Layout issues?**

- Clear browser cache
- Check for any console errors
- Ensure Tailwind CSS is properly configured

**Navigation not working?**

- Verify the route is added to `/src/routes/index.jsx`
- Check that the navbar links use the correct path (`/about`)
