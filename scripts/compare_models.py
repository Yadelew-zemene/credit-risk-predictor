"""
Model comparison for the Home Credit Default Risk project.

Purpose:Compare candidate models using the same validation metrics.
Model-selection metric: PR-AUC

Important:The test set is intentionally not used here.
"""


def main():
    results = [
        {
            "model": "Logistic Regression",
            "roc_auc": 0.7509,
            "pr_auc": 0.2345,
            "f1_050": 0.2597,
            "f1_060": 0.2934,
        },
        {
            "model": "XGBoost Baseline",
            "roc_auc": 0.7659,
            "pr_auc": 0.2558,
            "f1_050": 0.2835,
            "f1_060": 0.3059,
        },
        {
            "model": "XGBoost Tuned",
            "roc_auc": 0.7675,
            "pr_auc": 0.2607,
            "f1_050": 0.2795,
            "f1_060": 0.3074,
        },
    ]

    print("\nMODEL COMPARISON")
    print("================")

    print(
        f"{'Model':25} "
        f"{'ROC-AUC':>10} "
        f"{'PR-AUC':>10} "
        f"{'F1@0.50':>10} "
        f"{'F1@0.60':>10}"
    )

    print("-" * 70)

    for result in results:
        print(
            f"{result['model']:25} "
            f"{result['roc_auc']:>10.4f} "
            f"{result['pr_auc']:>10.4f} "
            f"{result['f1_050']:>10.4f} "
            f"{result['f1_060']:>10.4f}"
        )

    print("\nSelected model: XGBoost Tuned")
    print("Primary metric: PR-AUC")
    print("Selected threshold candidate: 0.60")


if __name__ == "__main__":
    main()