export default defineEventHandler((event) => {
        appendHeader(event, "Cache-Control", `max-age=${60} s-maxage=${60}`);
});