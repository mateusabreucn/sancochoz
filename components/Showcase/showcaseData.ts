export type Category = "webdesign" | "socialmedia" | "videomaking";

export const videoData: Record<Category, { src: string; title: string }[]> = {
  socialmedia: [
    { src: "/ShowcaseVideos/SocialMedia/APIPC.mp4", title: "APIPC" },
    { src: "/ShowcaseVideos/SocialMedia/CHQ.mp4", title: "CHQ" },
    { src: "/ShowcaseVideos/SocialMedia/Imagine.mp4", title: "Imagine" },
    { src: "/ShowcaseVideos/SocialMedia/RioSambaXP.mp4", title: "RioSambaXP" },
  ],
  videomaking: [
    { src: "/ShowcaseVideos/Videomaking/Alameda.mp4", title: "Alameda" },
    { src: "/ShowcaseVideos/Videomaking/Boat Party.mp4", title: "Boat Party" },
    { src: "/ShowcaseVideos/Videomaking/Flora.mp4", title: "Flora" },
    { src: "/ShowcaseVideos/Videomaking/Imagine Eventos.mp4", title: "Imagine Eventos" },
    { src: "/ShowcaseVideos/Videomaking/James.mp4", title: "James" },
    { src: "/ShowcaseVideos/Videomaking/Minha Infância.mp4", title: "Minha Infância" },
    { src: "/ShowcaseVideos/Videomaking/RioSamba.mp4", title: "RioSamba" },
    { src: "/ShowcaseVideos/Videomaking/Spot Alameda.mp4", title: "Spot Alameda" },
  ],
  webdesign: [
    { src: "/ShowcaseVideos/Website/Amanda.mp4", title: "Amanda" },
  ],
};
