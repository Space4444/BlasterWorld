-- CreateTable
CREATE TABLE "players" (
    "p_id" TEXT NOT NULL PRIMARY KEY,
    "money" INTEGER NOT NULL,
    "orb" TEXT,
    "ship" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "items" (
    "player" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "place" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,

    PRIMARY KEY ("player", "place", "position")
);
