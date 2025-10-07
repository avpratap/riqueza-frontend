# Public Assets Directory

This directory contains all the static assets for the Ola Electric Clone application.

## Folder Structure

### `/images/`
- **Hero Images**: `hero-scooter-1.jpg`, `hero-scooter-2.jpg`
- **Product Images**: Product photos and thumbnails
- **Banner Images**: Marketing banners and promotional images
- **Background Images**: Background patterns and textures

### `/logo/`
- **Company Logo**: Main Ola Electric logo (PNG format)
- **Logo Variations**: Different sizes and color versions
- **Favicon**: Browser tab icon

### `/icons/`
- **Custom Icons**: Application-specific icons not available in Lucide React
- **SVG Icons**: Scalable vector graphics for special use cases

### `/fonts/`
- **Custom Fonts**: Any custom font files (if needed)
- **Font Licenses**: Font usage licenses and documentation

## Usage

- **Images**: Use in components with `next/image` for optimization
- **Logo**: Import in Header and Footer components
- **Icons**: Use as fallback when Lucide React icons aren't sufficient
- **Fonts**: Import in CSS if using custom fonts

## File Naming Convention

- Use kebab-case for file names
- Include dimensions in filename when relevant (e.g., `logo-32x32.png`)
- Use descriptive names that indicate content and purpose

## Optimization

- **Images**: Use WebP format when possible for better compression
- **SVGs**: Optimize SVG files to reduce file size
- **Compression**: Compress images before adding to maintain fast loading
