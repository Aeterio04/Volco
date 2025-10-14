import React from 'react';
import './ContactPage.css';

interface ContactInfoItem {
  label: string;
  value: React.ReactNode;
}

interface InstructionItem {
  title: string;
  items: string[];
}

interface ContactCardProps {
  type: 'students' | 'ngo';
  icon: string;
  title: string;
  description: string;
  contactInfo: ContactInfoItem[];
  instructions: InstructionItem;
}

const ContactCard: React.FC<ContactCardProps> = ({ 
  type, 
  icon, 
  title, 
  description, 
  contactInfo, 
  instructions 
}) => {
  return (
    <div className={`contact-card ${type === 'ngo' ? 'ngo-card' : ''}`}>
      <div className="card-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      
      <div className="contact-info">
        {contactInfo.map((info, index) => (
          <div key={index} className="info-item">
            <span className="info-label">{info.label}:</span>
            <span className="info-value">{info.value}</span>
          </div>
        ))}
      </div>

      <div className="instructions-box">
        <h4>{instructions.title}</h4>
        <ul>
          {instructions.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ContactPage: React.FC = () => {
  const studentsData: Omit<ContactCardProps, 'type'> = {
    icon: "🎓",
    title: "For Students",
    description: "Looking to volunteer or have questions about opportunities? We're here to help PICT students find the perfect way to make a difference.",
    contactInfo: [
      {
        label: "Email",
        value: <a href="mailto:studyjee.co@gmail.com" className="email-link">studyjee.co@gmail.com</a>
      },
      {
        label: "For",
        value: "PICT Students Only"
      }
    ],
    instructions: {
      title: "Get in Touch For:",
      items: [
        "Questions about volunteer opportunities",
        "Technical support with the platform",
        "Suggestions and feedback",
        "Event inquiries"
      ]
    }
  };

  const ngoData: Omit<ContactCardProps, 'type'> = {
    icon: "🤝",
    title: "For NGOs",
    description: "Want to partner with us and connect with dedicated student volunteers? Register your organization to get started.",
    contactInfo: [
      {
        label: "Email",
        value: <a href="mailto:studyjee.co@gmail.com" className="email-link">studyjee.co@gmail.com</a>
      },
      {
        label: "Subject",
        value: "NGO Registration Request"
      }
    ],
    instructions: {
      title: "Registration Process:",
      items: [
        "Send an email with your organization details",
        "Include your NGO's name and registration number",
        "Describe your organization's motto and mission",
        "Share your areas of work and impact goals",
        "Our team will review and contact you within 3-5 business days"
      ]
    }
  };

  return (
    
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>We're here to help students and NGOs connect for positive change</p>
        </div>

        <div className="contact-grid">
          <ContactCard type="students" {...studentsData} />
          <ContactCard type="ngo" {...ngoData} />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;