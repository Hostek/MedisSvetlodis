import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1750340733518 implements MigrationInterface {
    name = 'InitialMigration1750340733518'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "channel" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "uniqueIdentifier" character varying NOT NULL, CONSTRAINT "UQ_5cf8f2f00ac8dc4c547d548028a" UNIQUE ("uniqueIdentifier"), CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "creatorId" integer NOT NULL, "content" text NOT NULL, "channelId" integer NOT NULL, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "friend_requests" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "senderId" integer NOT NULL, "requestTokenId" integer NOT NULL, "status" character varying(30) NOT NULL DEFAULT 'pending', CONSTRAINT "UQ_TOKEN_SENDER" UNIQUE ("requestTokenId", "senderId"), CONSTRAINT "PK_3827ba86ce64ecb4b90c92eeea6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "friend_request_token" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "token" text NOT NULL, "usage_count" integer NOT NULL DEFAULT '0', "max_limit" integer, "status" character varying(30) NOT NULL DEFAULT 'active', "deletedDate" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_7ded75ab1302c57bef2cdf49746" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "block" ("id" SERIAL NOT NULL, "blockerId" integer NOT NULL, "blockedId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f147961a77e760d035e5cb1f33a" UNIQUE ("blockerId", "blockedId"), CONSTRAINT "PK_d0925763efb591c2e2ffb267572" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "password" character varying NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "identifier" text NOT NULL, "avatarBgColor" character varying NOT NULL DEFAULT '#6A4A2E', "updateUsernameAttempts" integer NOT NULL DEFAULT '3', "generatedDefaultFriendRequestTokens" boolean NOT NULL DEFAULT false, "numberOfFriendRequests" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_7efb296eadd258e554e84fa6eb6" UNIQUE ("identifier"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_friends" ("user_id" integer NOT NULL, "friend_id" integer NOT NULL, CONSTRAINT "PK_657d2355d5000f103ff3612447f" PRIMARY KEY ("user_id", "friend_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_73aac2cba30951ed7c7000c614" ON "user_friends" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_24f1e41a3801477d44228395e3" ON "user_friends" ("friend_id") `);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_e04040c4ea7133eeddefff6417d" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_5fdbbcb32afcea663c2bea2954f" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friend_requests" ADD CONSTRAINT "FK_da724334b35796722ad87d31884" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friend_requests" ADD CONSTRAINT "FK_106f3428f1bf97b8f8af5c350dc" FOREIGN KEY ("requestTokenId") REFERENCES "friend_request_token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friend_request_token" ADD CONSTRAINT "FK_8629aa2db7a685da4820a56b12e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "block" ADD CONSTRAINT "FK_9ebc8defd368bfbada61840691b" FOREIGN KEY ("blockerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "block" ADD CONSTRAINT "FK_d5c13d1ced558f476dd2268c4eb" FOREIGN KEY ("blockedId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_friends" ADD CONSTRAINT "FK_USER_FRIENDS" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_friends" ADD CONSTRAINT "FK_FRIEND_USERS" FOREIGN KEY ("friend_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_friends" DROP CONSTRAINT "FK_FRIEND_USERS"`);
        await queryRunner.query(`ALTER TABLE "user_friends" DROP CONSTRAINT "FK_USER_FRIENDS"`);
        await queryRunner.query(`ALTER TABLE "block" DROP CONSTRAINT "FK_d5c13d1ced558f476dd2268c4eb"`);
        await queryRunner.query(`ALTER TABLE "block" DROP CONSTRAINT "FK_9ebc8defd368bfbada61840691b"`);
        await queryRunner.query(`ALTER TABLE "friend_request_token" DROP CONSTRAINT "FK_8629aa2db7a685da4820a56b12e"`);
        await queryRunner.query(`ALTER TABLE "friend_requests" DROP CONSTRAINT "FK_106f3428f1bf97b8f8af5c350dc"`);
        await queryRunner.query(`ALTER TABLE "friend_requests" DROP CONSTRAINT "FK_da724334b35796722ad87d31884"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_5fdbbcb32afcea663c2bea2954f"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_e04040c4ea7133eeddefff6417d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_24f1e41a3801477d44228395e3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_73aac2cba30951ed7c7000c614"`);
        await queryRunner.query(`DROP TABLE "user_friends"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "block"`);
        await queryRunner.query(`DROP TABLE "friend_request_token"`);
        await queryRunner.query(`DROP TABLE "friend_requests"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "channel"`);
    }

}
