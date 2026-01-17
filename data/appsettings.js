const appsettings = {
    imagePathHomeSlide: 'images/',
    companyDetails: {
        name: 'Pearson Pharmaceutical',
        tagline: 'Prememium Quality Medicines Supplier',
        description: 'Pearson Pharmaceutical focuses on delivering premium pharmaceuticals in the B2B sector. Through competitive pricing, dedication to quality, and a focus on customers, we provide distributors, retailers, and healthcare professionals with reliable pharmaceutical products.',
        logoPath: 'images/logo.svg',
        contact: {
            address: '227 Apple Square, Surat - 395010, Gujarat, India',
            phone: '+91 95122 57160',
            email: 'pearsonpharmaceutical@gmail.com'
        },
        regulatory: {
            gst: '24AFIFS9710E1ZZ',
            drugLicense: 'GJ-SUR-242706, GJ-SUR-242707',
            established: '2024'
        },
        whatsapp: {
            phoneNumber: '+919512257160', 
            message: 'Hello! I am interested in your pharmaceutical products. Can you provide more information?' 
        },
        gmail: {
            webhookUrl: 'https://script.google.com/macros/s/AKfycbyEQ4DmNwdy3m3Q8GwgU5OLpWVE3HPoSXZ7It8ia6pgEAaYgY_0fzxQrd6T9l5_jrD8QA/exec' 
        }
    }
};

// Expose to `window` so other scripts can read `window.appsettings` (top-level const isn't on window)
window.appsettings = appsettings;