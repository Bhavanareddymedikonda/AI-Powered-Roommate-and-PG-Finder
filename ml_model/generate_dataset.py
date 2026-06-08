"""
Generate a roommate compatibility dataset based on the 8 survey questions.

Features (all are absolute differences between two users, range 0-4):
  cleanliness_diff, social_diff, sleep_diff, guestPolicy_diff,
  noise_diff, cooking_diff, workSchedule_diff, petFriendly_diff

Target: score (0-100, higher = more compatible)

Logic: Each question is rated 1-5, so the max diff per question is 4.
       Total max diff across 8 questions = 32.
       Score ≈ 100 * (1 - total_diff / 32) with some weighted adjustments
       and random noise for realism.
"""

import csv
import random
import itertools

random.seed(42)

FEATURES = [
    "cleanliness_diff",
    "social_diff",
    "sleep_diff",
    "guestPolicy_diff",
    "noise_diff",
    "cooking_diff",
    "workSchedule_diff",
    "petFriendly_diff",
]

# Weights: how much each factor impacts compatibility (higher = more important)
WEIGHTS = {
    "cleanliness_diff": 1.4,
    "social_diff": 1.1,
    "sleep_diff": 1.3,
    "guestPolicy_diff": 1.2,
    "noise_diff": 1.2,
    "cooking_diff": 0.8,
    "workSchedule_diff": 0.7,
    "petFriendly_diff": 1.0,
}

MAX_DIFF_PER_FEATURE = 4
SAMPLES_PER_COMBO = 5  # multiple samples per combination for variance


def compute_score(diffs):
    """Compute a compatibility score given a dict of diffs."""
    weighted_sum = sum(WEIGHTS[f] * diffs[f] for f in FEATURES)
    max_weighted = sum(WEIGHTS[f] * MAX_DIFF_PER_FEATURE for f in FEATURES)

    # Base score: 100 when perfectly matched, ~20 when maximum mismatch
    base = 100 * (1 - weighted_sum / max_weighted)

    # Scale to 20-100 range
    score = 20 + (base / 100) * 80

    # Add noise
    noise = random.gauss(0, 3)
    score = round(max(20, min(100, score + noise)))
    return score


def main():
    rows = []

    # Generate combinations of diffs (0-4 per feature, but we sample a subset)
    # Full grid of 5^8 = 390625 is too large; instead sample smartly
    # Use binary (0 vs 1+) like original, plus finer granularity

    # Strategy 1: All binary combos (0 or 1 for low/high diff) x multiple samples
    for combo in itertools.product([0, 1], repeat=8):
        for _ in range(SAMPLES_PER_COMBO):
            diffs = {}
            for i, f in enumerate(FEATURES):
                if combo[i] == 0:
                    diffs[f] = random.choice([0, 1])  # low diff
                else:
                    diffs[f] = random.choice([2, 3, 4])  # high diff
            score = compute_score(diffs)
            row = [diffs[f] for f in FEATURES] + [score]
            rows.append(row)

    # Strategy 2: Random samples for diversity
    for _ in range(500):
        diffs = {f: random.randint(0, 4) for f in FEATURES}
        score = compute_score(diffs)
        row = [diffs[f] for f in FEATURES] + [score]
        rows.append(row)

    # Shuffle
    random.shuffle(rows)

    # Write CSV
    with open("roommate_compatibility_dataset.csv", "w", newline="") as f:
        writer = csv.writer(f, quoting=csv.QUOTE_ALL)
        writer.writerow(FEATURES + ["score"])
        writer.writerows(rows)

    print(f"✅ Generated {len(rows)} rows → roommate_compatibility_dataset.csv")


if __name__ == "__main__":
    main()
