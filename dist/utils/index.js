function getPublicIdFromUrl(url) {
    const regex = /\/(?:v\d+\/)?([^/]+)\.\w+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
}
//   const imageUrl = "https://res.cloudinary.com/dw4eomgcg/image/upload/v1729227578/uploads/vwedeflmsdd04t1usrhp.png";
export default getPublicIdFromUrl;
