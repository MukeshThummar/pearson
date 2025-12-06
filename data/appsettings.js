const appsettings = {
    imagePathHomeSlide: 'images/',
    companyDetails: {
        name: 'Pearson Pharmaceutical',
        tagline: 'Newly Established - Growing Together',
        description: 'Pearson Pharmaceutical specializes in providing high-quality medicines in the B2B market. With competitive pricing, a commitment to quality, and a customer-first approach, we serve distributors, retailers, and healthcare providers with trusted pharmaceutical products.',
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
        }
    }
};

// Expose to `window` so other scripts can read `window.appsettings` (top-level const isn't on window)
window.appsettings = appsettings;