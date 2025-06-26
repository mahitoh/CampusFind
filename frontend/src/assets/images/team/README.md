# Team Member Photos

This directory contains profile photos for the CampusFind development team.

## Adding Team Member Photos

To add your team member photo:

1. Add your image file to this directory (preferred formats: .jpg, .png, .webp)
2. Name the file with a descriptive name (e.g., `john_doe.jpg`, `member1.png`)
3. Update the `teamMembers` array in `/src/pages/AboutUs.jsx` with:
   - Your actual name
   - Your role in the project
   - The path to your image (e.g., `/src/assets/images/team/your_image.jpg`)
   - A brief description of your contributions

## Image Guidelines

- **Size**: 300x300 pixels recommended
- **Format**: JPG, PNG, or WebP
- **File size**: Keep under 500KB for optimal performance
- **Style**: Professional headshot or casual photo

## Current Placeholder Images

The About Us page currently uses placeholder images that will be replaced when you add actual team member photos. If no custom image is provided, the page will automatically generate an avatar using the team member's name.

## Example Usage

```javascript
{
  id: 1,
  name: "John Doe",
  role: "Full Stack Developer",
  image: "/src/assets/images/team/john_doe.jpg",
  description: "Led the backend development and API design."
}
```
