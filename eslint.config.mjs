import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default [
  ...nextCoreWebVitals,
  {
    files: ["app/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/types/users",
              importNames: ["SelectUser", "NewUser", "NewGoogleUser", "UserSchema"],
              message:
                "Server-only type. Use PublicUser (or a service verb that returns one) from app code.",
            },
            {
              name: "@/types/trainers",
              importNames: ["SelectTrainer", "NewTrainer", "TrainerSchema"],
              message:
                "Server-only type. Use PublicTrainer or PublicTrainerUser from app code.",
            },
          ],
        },
      ],
    },
  },
];
