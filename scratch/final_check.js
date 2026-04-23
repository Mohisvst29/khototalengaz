const lucide = require('lucide-react');
const icons = ['Share2', 'Image', 'MessageCircle', 'MessageSquare', 'Phone', 'Mail', 'MapPin', 'Menu', 'X', 'Search', 'Building', 'Undo'];
icons.forEach(icon => console.log(`${icon}: ${!!lucide[icon]}`));
