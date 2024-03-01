import { get_movies } from "../javascript/get-movies";

describe("get_movies", () => {
    it("should return an array of movies", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            text: jest.fn().mockResolvedValue(JSON.stringify({ results: ["Movie 1", "Movie 2"] })),
        });
        const movies = await get_movies();
        expect(movies).toEqual(["Movie 1", "Movie 2"]);
    });

    it("should log an error if fetch fails", async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error("Fetch failed"));
        console.error = jest.fn();

        await get_movies();
        expect(console.error).toHaveBeenCalledWith(new Error("Fetch failed"));
    });
});
