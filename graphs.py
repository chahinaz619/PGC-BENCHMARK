# graphs.py — FINAL SCIENTIFIC VERSION
# -------------------------------------------------------
# Generates graphs for:
#   ✔ execution time (ms)
#   ✔ CPU cycles
#   ✔ memory usage (MB)
#   ✔ estimated energy (J)
# -------------------------------------------------------

import pandas as pd
import matplotlib.pyplot as plt
import glob
import os

# Location of CSV files
csv_folder = "./"
csv_files = glob.glob(csv_folder + "results_*.csv")

# IMPORTANT: Mapping CSV filenames → algorithm name
def clean_name(path):
    name = os.path.basename(path)
    name = name.replace("results_", "").replace(".csv", "")
    return name

for csv_file in csv_files:
    df = pd.read_csv(csv_file)
    scheme = clean_name(csv_file)

    print(f"\nProcessing: {scheme}")

    # Identify types of metrics
    time_cols = [c for c in df.columns if "ms" in c]
    cycles_cols = [c for c in df.columns if "cycles" in c]
    mem_cols = [c for c in df.columns if "mem" in c]
    energy_cols = [c for c in df.columns if "energy" in c]

    # -------------------------------
    # GENERATE TIME GRAPHS
    # -------------------------------
    for col in time_cols:
        plt.figure(figsize=(10, 6))
        plt.plot(df["iteration"], df[col], marker="o")
        plt.title(f"{scheme.upper()} — {col} (Time)")
        plt.xlabel("Iteration")
        plt.ylabel("Time (ms)")
        plt.grid(True)
        output = f"graph_{scheme}_{col}.png"
        plt.tight_layout()
        plt.savefig(output)
        plt.close()
        print(f"✔ Saved {output}")

    # -------------------------------
    # GENERATE CPU CYCLES GRAPHS
    # -------------------------------
    for col in cycles_cols:
        plt.figure(figsize=(10, 6))
        plt.plot(df["iteration"], df[col], marker="o", color="red")
        plt.title(f"{scheme.upper()} — {col} (CPU Cycles)")
        plt.xlabel("Iteration")
        plt.ylabel("Cycles")
        plt.grid(True)
        output = f"graph_{scheme}_{col}.png"
        plt.tight_layout()
        plt.savefig(output)
        plt.close()
        print(f"✔ Saved {output}")

    # -------------------------------
    # GENERATE MEMORY USAGE GRAPHS
    # -------------------------------
    for col in mem_cols:
        plt.figure(figsize=(10, 6))
        plt.plot(df["iteration"], df[col], marker="o", color="green")
        plt.title(f"{scheme.upper()} — {col} (Memory)")
        plt.xlabel("Iteration")
        plt.ylabel("Memory (MB)")
        plt.grid(True)
        output = f"graph_{scheme}_{col}.png"
        plt.tight_layout()
        plt.savefig(output)
        plt.close()
        print(f"✔ Saved {output}")

    # -------------------------------
    # GENERATE ENERGY GRAPHS
    # -------------------------------
    for col in energy_cols:
        plt.figure(figsize=(10, 6))
        plt.plot(df["iteration"], df[col], marker="o", color="purple")
        plt.title(f"{scheme.upper()} — {col} (Energy)")
        plt.xlabel("Iteration")
        plt.ylabel("Energy (J)")
        plt.grid(True)
        output = f"graph_{scheme}_{col}.png"
        plt.tight_layout()
        plt.savefig(output)
        plt.close()
        print(f"✔ Saved {output}")

print("\n🎉 All graphs generated successfully!")
