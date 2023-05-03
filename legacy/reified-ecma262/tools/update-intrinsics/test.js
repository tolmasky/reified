const given = f => f();

const deintrinsify = name => name.replace(/^%|%$/g, "");
const toSectionIDXPathQuery = given((
    dashcased = name =>
        name.replace(/([a-z])([A-Z])/g, (_, lhs, rhs) => `${lhs}-${rhs}`),
    lowercased = name => name.toLowerCase(),
    transforms = [deintrinsify, dashcased],
    permutations = [0, 1, 2, 3].map(permutation => given((
        filtered = transforms
            .filter((_, index) => permutation & (1 << index))) =>
            name => filtered.reduce((name, transform) => transform(name), name).toLowerCase())),
    toPermutedVariants = name => permutations.map(transform => transform(name))) =>
        name => given((
            IDs = toPermutedVariants(name).flatMap(ID => [`sec-${ID}`, `sec-get-${ID}`])) =>
                `//emu-clause[${IDs
                    .map(ID => `starts-with(@id, "${ID}")`)
                    .join(" or ")}]`));

console.log(toSectionIDXPathQuery("%AsyncFunction%"));