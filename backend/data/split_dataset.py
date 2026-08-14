import pandas as pd
from sklearn.model_selection import train_test_split

# Load original dataset
df = pd.read_csv("diabetes.csv")

# First: Hospital A = 250 rows
hospital_A, remaining = train_test_split(
    df,
    train_size=250,
    random_state=42,
    stratify=df["Outcome"]
)

# Second: Hospital B = 260 rows
hospital_B, hospital_C = train_test_split(
    remaining,
    train_size=260,
    random_state=42,
    stratify=remaining["Outcome"]
)

# Save files
hospital_A.to_csv("hospital_A.csv", index=False)
hospital_B.to_csv("hospital_B.csv", index=False)
hospital_C.to_csv("hospital_C.csv", index=False)

print("Hospital A:", len(hospital_A), "rows")
print("Hospital B:", len(hospital_B), "rows")
print("Hospital C:", len(hospital_C), "rows")
print("Total:", len(hospital_A) + len(hospital_B) + len(hospital_C), "rows")
print("\nFiles created successfully!")