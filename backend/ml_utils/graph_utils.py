import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, roc_curve, auc, precision_recall_curve
from sklearn.preprocessing import label_binarize
import numpy as np
import scipy.stats as stats

# Your existing functions remain the same...
def save_confusion_matrix_graph(y_true, y_pred, path):
    plt.figure(figsize=(6, 4))
    cm = confusion_matrix(y_true, y_pred)
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
    plt.title("Confusion Matrix")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.tight_layout()
    plt.savefig(path)
    plt.close()

def save_roc_curve_graph(y_true, y_proba, path):
    fpr, tpr, _ = roc_curve(y_true, y_proba)
    roc_auc = auc(fpr, tpr)
    plt.figure()
    plt.plot(fpr, tpr, color='darkorange', label=f'AUC = {roc_auc:.2f}')
    plt.plot([0, 1], [0, 1], color='navy', linestyle='--')
    plt.title("ROC Curve")
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.legend()
    plt.tight_layout()
    plt.savefig(path)
    plt.close()

def save_precision_recall_graph(y_true, y_proba, path):
    precision, recall, _ = precision_recall_curve(y_true, y_proba)
    plt.figure()
    plt.plot(recall, precision, marker='.')
    plt.title("Precision-Recall Curve")
    plt.xlabel("Recall")
    plt.ylabel("Precision")
    plt.tight_layout()
    plt.savefig(path)
    plt.close()

# NEW MULTICLASS FUNCTIONS
def save_multiclass_roc_curve_graph(y_true, y_proba, path):
    """
    Generate ROC curves for multiclass classification using One-vs-Rest approach
    """
    classes = np.unique(y_true)
    n_classes = len(classes)
    
    # Binarize the output for multiclass ROC
    y_true_bin = label_binarize(y_true, classes=classes)
    if n_classes == 2:
        y_true_bin = np.hstack((1 - y_true_bin, y_true_bin))
    
    plt.figure(figsize=(8, 6))
    colors = plt.cm.Set1(np.linspace(0, 1, n_classes))
    
    # Compute ROC curve and AUC for each class
    for i, color in zip(range(n_classes), colors):
        if n_classes == 2 and i == 0:
            continue  # Skip the first class for binary case
        
        fpr, tpr, _ = roc_curve(y_true_bin[:, i], y_proba[:, i])
        roc_auc = auc(fpr, tpr)
        
        plt.plot(fpr, tpr, color=color, lw=2,
                label=f'Class {classes[i]} (AUC = {roc_auc:.2f})')
    
    # Compute micro-average ROC curve and AUC
    fpr_micro, tpr_micro, _ = roc_curve(y_true_bin.ravel(), y_proba.ravel())
    roc_auc_micro = auc(fpr_micro, tpr_micro)
    
    plt.plot(fpr_micro, tpr_micro,
             label=f'Micro-average (AUC = {roc_auc_micro:.2f})',
             color='deeppink', linestyle=':', linewidth=2)
    
    plt.plot([0, 1], [0, 1], 'k--', lw=1)
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('Multiclass ROC Curves')
    plt.legend(loc="lower right")
    plt.tight_layout()
    plt.savefig(path)
    plt.close()

def save_multiclass_precision_recall_graph(y_true, y_proba, path):
    """
    Generate Precision-Recall curves for multiclass classification
    """
    classes = np.unique(y_true)
    n_classes = len(classes)
    
    # Binarize the output for multiclass PR curves
    y_true_bin = label_binarize(y_true, classes=classes)
    if n_classes == 2:
        y_true_bin = np.hstack((1 - y_true_bin, y_true_bin))
    
    plt.figure(figsize=(8, 6))
    colors = plt.cm.Set1(np.linspace(0, 1, n_classes))
    
    # Compute PR curve for each class
    for i, color in zip(range(n_classes), colors):
        if n_classes == 2 and i == 0:
            continue  # Skip the first class for binary case
            
        precision, recall, _ = precision_recall_curve(y_true_bin[:, i], y_proba[:, i])
        pr_auc = auc(recall, precision)
        
        plt.plot(recall, precision, color=color, lw=2,
                label=f'Class {classes[i]} (AUC = {pr_auc:.2f})')
    
    # Compute micro-average PR curve
    precision_micro, recall_micro, _ = precision_recall_curve(
        y_true_bin.ravel(), y_proba.ravel())
    pr_auc_micro = auc(recall_micro, precision_micro)
    
    plt.plot(recall_micro, precision_micro,
             label=f'Micro-average (AUC = {pr_auc_micro:.2f})',
             color='deeppink', linestyle=':', linewidth=2)
    
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('Recall')
    plt.ylabel('Precision')
    plt.title('Multiclass Precision-Recall Curves')
    plt.legend()
    plt.tight_layout()
    plt.savefig(path)
    plt.close()

# Your existing regression functions remain the same...
def save_residual_plot(y_true, y_pred, path):
    residuals = y_true - y_pred
    plt.figure(figsize=(6, 4))
    sns.scatterplot(x=y_pred, y=residuals, alpha=0.7)
    plt.axhline(0, color='red', linestyle='--')
    plt.title("Residual Plot")
    plt.xlabel("Predicted Values")
    plt.ylabel("Residuals")
    plt.tight_layout()
    plt.savefig(path)
    plt.close()

def save_actual_vs_predicted_plot(y_true, y_pred, path):
    plt.figure(figsize=(6, 4))
    sns.scatterplot(x=y_true, y=y_pred, alpha=0.7)
    plt.plot([y_true.min(), y_true.max()], [y_true.min(), y_true.max()], color='red', linestyle='--')
    plt.title("Actual vs Predicted")
    plt.xlabel("Actual Values")
    plt.ylabel("Predicted Values")
    plt.tight_layout()
    plt.savefig(path)
    plt.close()

def save_error_distribution_plot(y_true, y_pred, path):
    errors = y_true - y_pred
    plt.figure(figsize=(6, 4))
    sns.histplot(errors, kde=True, bins=30)
    plt.title("Prediction Error Distribution")
    plt.xlabel("Error")
    plt.ylabel("Frequency")
    plt.tight_layout()
    plt.savefig(path)
    plt.close()

def save_qq_plot(y_true, y_pred, path):
    residuals = y_true - y_pred
    plt.figure(figsize=(6, 4))
    stats.probplot(residuals, dist="norm", plot=plt)
    plt.title("Q-Q Plot of Residuals")
    plt.tight_layout()
    plt.savefig(path)
    plt.close()