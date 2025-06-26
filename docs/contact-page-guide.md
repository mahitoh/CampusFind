# Contact Page Documentation

## Overview

The Contact page (`/src/pages/Contact.jsx`) provides multiple ways for users to get in touch with the CampusFind team and includes helpful resources.

## Features

### 📞 Contact Methods

- **Email**: Multiple email addresses for different purposes
- **Phone**: Direct phone line with office hours
- **Campus Location**: Physical office location for in-person visits
- **Office Hours**: Clear availability schedule
- **Emergency Contact**: 24/7 campus security contact for urgent matters

### 📝 Contact Form

- **Form Fields**:
  - Full Name (required)
  - Email Address (required)
  - Subject dropdown with predefined categories
  - Message textarea (required)
- **Subject Categories**:
  - I lost an item
  - I found an item
  - Technical Support
  - General Inquiry
  - Feedback
  - Other
- **Form Validation**: Client-side validation for required fields
- **Success Feedback**: Confirmation message after form submission

### ❓ FAQ Section

Pre-answers common questions about:

- How to report lost items
- What to do when finding items
- Service fees (free service)
- How to claim found items

## Customization Guide

### Update Contact Information

1. **Email Addresses** (lines ~70-72):

```jsx
<p className="text-gray-600">contact@campusfind.edu</p>
<p className="text-gray-600">support@campusfind.edu</p>
```

2. **Phone Number** (line ~82):

```jsx
<p className="text-gray-600">+1 (555) 123-4567</p>
```

3. **Campus Location** (lines ~94-97):

```jsx
<p className="text-gray-600">Student Services Building</p>
<p className="text-gray-600">Room 205, Second Floor</p>
<p className="text-gray-600">University Campus</p>
```

4. **Office Hours** (lines ~107-109):

```jsx
<p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
<p className="text-gray-600">Saturday: 10:00 AM - 2:00 PM</p>
<p className="text-gray-600">Sunday: Closed</p>
```

5. **Emergency Contact** (line ~123):

```jsx
contact Campus Security at <strong>+1 (555) 911-0000</strong>
```

### Form Integration

Currently, the form simulates submission with a timeout. To integrate with a real backend:

1. **Replace the simulation** (lines ~26-32) with an actual API call:

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } else {
      setSubmitStatus("error");
    }
  } catch (error) {
    setSubmitStatus("error");
  } finally {
    setIsSubmitting(false);
  }
};
```

2. **Add error handling** for failed submissions:

```jsx
{
  submitStatus === "error" && (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-800">
        Sorry, there was an error sending your message. Please try again.
      </p>
    </div>
  );
}
```

### Adding New FAQ Items

To add new FAQ items, add objects to the FAQ section (around line ~240):

```jsx
<div className="bg-gray-50 rounded-lg p-6">
  <h3 className="text-xl font-semibold text-gray-800 mb-3">
    Your Question Here?
  </h3>
  <p className="text-gray-600">Your answer here...</p>
</div>
```

## Styling Notes

### Color Scheme

- Primary Blue: `#098dc1`
- Primary Purple: `#a402cc`
- Success Green: `green-500`
- Warning Red: `red-600`
- Text Gray: `gray-800`, `gray-600`

### Responsive Design

- **Mobile First**: Stacked layout on mobile
- **Desktop**: Two-column layout (contact info + form)
- **Grid System**: Uses Tailwind's responsive grid classes

### Accessibility Features

- Proper form labels with `htmlFor` attributes
- Semantic HTML structure
- Color contrast compliance
- Screen reader friendly icons

## Navigation Integration

The Contact page is accessible via:

- **Desktop Navigation**: "Contact" link in main navbar
- **Mobile Navigation**: "Contact" link in hamburger menu
- **Direct URL**: `/contact`

## Backend Requirements

To fully implement the contact form, you'll need:

1. **API Endpoint**: `POST /api/contact`
2. **Email Service**: For sending form submissions
3. **Validation**: Server-side form validation
4. **Database** (optional): To store contact form submissions
5. **Notification System**: To alert admins of new messages

## Testing Checklist

- [ ] Form validates required fields
- [ ] Form submits successfully
- [ ] Success message displays
- [ ] Form resets after submission
- [ ] All contact information is accurate
- [ ] Navigation links work correctly
- [ ] Page is responsive on all devices
- [ ] FAQ section is helpful and accurate
