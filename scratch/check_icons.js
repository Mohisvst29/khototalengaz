const lucide = require('lucide-react');
const icons = [
  'Phone', 'Mail', 'MapPin', 'Twitter', 'Instagram', 'Linkedin', 'MessageCircle',
  'Undo', 'Search', 'Building', 'Menu', 'X', 'ChartLine', 'ShieldCheck', 'LayoutGrid',
  'Headset', 'Zap', 'MoveLeft', 'Send', 'MessageSquare', 'CheckCircle2', 'Plus',
  'Pencil', 'Trash2', 'Loader2', 'Image', 'Building2', 'Briefcase', 'Users',
  'TrendingUp', 'LayoutDashboard', 'Settings', 'LogOut', 'Bed', 'Bath', 'Maximize'
];

icons.forEach(icon => {
  if (!lucide[icon]) {
    console.log(`MISSING: ${icon}`);
  } else {
    console.log(`FOUND: ${icon}`);
  }
});
