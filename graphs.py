import pandas as pd
import matplotlib.pyplot as plt
import glob
import os

# Folder containing CSVs
csv_folder = './'
csv_files = glob.glob(os.path.join(csv_folder, 'results_*.csv'))

for csv_file in csv_files:
    df = pd.read_csv(csv_file)

    # Extract name safely (remove folder path + prefix)
    scheme_name = os.path.basename(csv_file).replace('results_', '').replace('.csv', '')

    # Columns that contain ms timing measurements
    timing_cols = [col for col in df.columns if 'ms' in col]

    for col in timing_cols:
        plt.figure(figsize=(10, 6))
        plt.plot(df.index + 1, df[col], marker='o')
        plt.title(f'{scheme_name} - {col}')
        plt.xlabel('Iteration')
        plt.ylabel('Time (ms)')
        plt.grid(True)
        plt.tight_layout()

        # Output filename (safe)
        output_file = f'graph_{scheme_name}_{col}.png'
        plt.savefig(output_file)
        plt.close()

        print(f'✔ Saved graph: {output_file}')

print('All graphs generated successfully.')
