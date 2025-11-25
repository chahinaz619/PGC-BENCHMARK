# graphs.py
# Python script to generate performance graphs from PQC benchmarking CSVs

import pandas as pd
import matplotlib.pyplot as plt
import glob

# Folder containing CSVs (adjust if needed)
csv_folder = './'
csv_files = glob.glob(csv_folder + 'results_*.csv')

for csv_file in csv_files:
    df = pd.read_csv(csv_file)
    scheme_name = csv_file.replace('results_', '').replace('.csv', '')

    # Identify columns for timing metrics
    timing_cols = [col for col in df.columns if 'ms' in col]

    for col in timing_cols:
        plt.figure(figsize=(10,6))
        plt.plot(df.index+1, df[col], marker='o')
        plt.title(f'{scheme_name} - {col}')
        plt.xlabel('Iteration')
        plt.ylabel('Time (ms)')
        plt.grid(True)
        plt.tight_layout()
        output_file = f'graph_{scheme_name}_{col}.png'
        plt.savefig(output_file)
        plt.close()
        print(f'✔ Saved graph: {output_file}')

print('All graphs generated successfully.')