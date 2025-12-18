export interface Experience {
    id: number;
    title_no: string;
    title_en: string;
    company: string;
    date_no: string;
    date_en: string;
    description_no: string;
    description_en: string;
    placement: number;
}

export interface Education {
    id: number;
    title_no: string;
    title_en: string;
    institution: string;
    date: string;
    placement: number;
}

export interface SiteSettings {
    id: number;
    bio_no: string;
    bio_en: string;
    contact_email: string;
    location_text: string;
    location_url: string;
    github_url: string;
    linkedin_url: string;
    profile_image_url: string;
    hero_subtitle_no: string;
    hero_subtitle_en: string;
    footer_description_no: string;
    footer_description_en: string;
    github_username: string;
    full_name: string;
    seo_description_no: string;
    seo_description_en: string;
    hero_title_no: string;
    hero_title_en: string;
}

